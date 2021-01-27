<?php

namespace Drupal\tb_megamenu\Controller;

use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\Core\Url;
use Drupal\tb_megamenu\Entity\MegaMenuConfig;
use Drupal\tb_megamenu\TBMegaMenuBuilder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Menu\MenuLinkTree;
use Drupal\Core\Render\RendererInterface;
use Drupal\Component\Serialization\Json;

/**
 * Handler for configuring and saving MegaMenu settings.
 */
class TBMegaMenuAdminController extends ControllerBase {

  /**
   * The menu tree service.
   *
   * @var \Drupal\Core\Menu\MenuLinkTree
   */
  protected $menuTree;

  /**
   * The renderer service.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * The menu builder service.
   *
   * @var \Drupal\tb_megamenu\TBMegaMenuBuilder
   */
  private $menuBuilder;

  /**
   * Constructs a TBMegaMenuAdminController object.
   *
   * @param \Drupal\Core\Menu\MenuLinkTree $menu_tree
   *   The Menu Link Tree service.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer service.
   * @param \Drupal\tb_megamenu\TBMegaMenuBuilder $menu_builder
   *   The menu builder service.
   */
  public function __construct(MenuLinkTree $menu_tree, RendererInterface $renderer, TBMegaMenuBuilder $menu_builder) {
    $this->menuTree = $menu_tree;
    $this->renderer = $renderer;
    $this->menuBuilder = $menu_builder;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('menu.link_tree'),
      $container->get('renderer'),
      $container->get('tb_megamenu.menu_builder')
    );
  }

  /**
   * Ajax callback for admin screen.
   *
   * Handles:  Save, Reset, and add block requests.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   A string response with either a success/error message or just data.
   */
  public function saveConfiguration(Request $request) {
    $data = NULL;
    $action = '';
    $result = 'Invalid TB Megamenu Ajax request!';

    // All ajax calls should use json data now.
    if ($request->getContentType() == 'json') {
      $data = Json::decode($request->getContent());
      $action = $data['action'];
    }
    // Assemble the appropriate Ajax response for the current action.
    switch ($action) {
      case 'load':
        $result = self::loadMenuConfig($data);
        break;

      case 'save':
        $result = self::saveMenuConfig($data);
        break;

      case 'load_block':
        $result = self::loadMenuBlock($data);
        break;

      default:
        break;
    }

    return new Response($result);
  }

  /**
   * Loads a menu configuration.
   *
   * @param array $data
   *   A decoded JSON object used to load the configuration.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   A string response with either a success/error message or just data.
   */
  public function loadMenuConfig(array $data) {
    $menu_name = self::getMenuName($data);
    $theme = self::getTheme($data);
    if ($menu_name && $theme) {
      $renderable_array = $this->menuBuilder->renderBlock($menu_name, $theme);
      $result = $this->renderer
        ->render($renderable_array)
        ->__toString();
    }

    return $result;
  }

  /**
   * Saves a menu configuration.
   *
   * @param array $data
   *   A decoded JSON object used to save the configuration.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   A string response with either a success/error message or just data.
   */
  public function saveMenuConfig(array $data) {
    $menu_config = self::getMenuConfig($data);
    $block_config = self::getBlockConfig($data);
    $menu_name = self::getMenuName($data);
    $theme = self::getTheme($data);

    // Ensure the config can be loaded before proceeding.
    $config = MegaMenuConfig::loadMenu($menu_name, $theme);
    if ($config === NULL) {
      $result = self::saveError('load_menu');
      return $result;
    }

    if ($menu_config && $menu_name && $block_config && $theme) {
      // This is parameter to load menu_tree with the enabled links.
      $menu_tree_parameters = (new MenuTreeParameters)->onlyEnabledLinks();
      // Load menu items with condition.
      $menu_items = $this->menuTree->load($menu_name, $menu_tree_parameters);
      // Sync mega menu before store.
      $this->menuBuilder->syncConfigAll($menu_items, $menu_config, 'backend');
      $this->menuBuilder->syncOrderMenus($menu_config);
      $config->setBlockConfig($block_config);
      $config->setMenuConfig($menu_config);
      // Save the config and return a success message.
      $saved_config = $config->save();
      if ($saved_config == 1 || $saved_config == 2) {
        $result = $this->t("Saved config sucessfully!");
      }
    }
    // Display an error when required values are missing.
    else {
      $result = self::saveError('missing_info', $menu_name, $theme, $block_config, $menu_config);
    }

    return $result;
  }

  /**
   * Displays and logs an error when config can't be saved.
   *
   * @param string $event
   *   The event that triggered the error.
   * @param string $menu_name
   *   The machine name for the current menu.
   * @param string $theme
   *   The machine name for the current theme.
   * @param array $block_config
   *   The configuration for the current block.
   * @param array $menu_config
   *   The configuration for the current menu.
   *
   * @return string
   *   An error message displayed to the user.
   */
  public function saveError(string $event, string $menu_name = NULL, string $theme = NULL, array $block_config = NULL, array $menu_config = NULL) {
    $msg = $this->t("Error Saving TB MegaMenu configuration:");

    switch ($event) {
      case 'load_menu':
        $msg .= $this->t("Could not load the menu.");
        break;

      case 'missing_info':
        $problem = ($menu_name ? '' : "menu_name ") . ($theme ? '' : "theme_name ") .
        ($block_config ? '' : "block_config ") . ($menu_config ? '' : "menu_config");
        $msg .= $this->t(
          "Post was missing the following information: @problem",
          ['@problem' => $problem]);
        break;

      default:
        $msg .= $this->t("An unknown error occurred.");
    }

    $this->messenger()->addStatus($msg);
    return $msg;
  }

  /**
   * Loads a menu block.
   *
   * @param array $data
   *   A decoded JSON object used to load the block.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   A string response with either a success/error message or just data.
   */
  public function loadMenuBlock(array $data) {
    $block_id = isset($data['block_id']) ? $data['block_id'] : NULL;
    $id = isset($data['id']) ? $data['id'] : NULL;
    $showblocktitle = isset($data['showblocktitle']) ? $data['showblocktitle'] : NULL;
    if ($block_id && $id) {
      $render = [
        '#theme' => 'tb_megamenu_block',
        '#block_id' => $block_id,
        '#section' => 'backend',
        '#showblocktitle' => $showblocktitle,
      ];
      $content = $this->renderer
        ->render($render)
        ->__toString();
      $result = Json::encode(['content' => $content, 'id' => $id]);
    }

    return $result;
  }

  /**
   * Get the machine name of a menu.
   *
   * @param array $data
   *   A decoded JSON object used to load the configuration.
   *
   * @return mixed
   *   A string or null.
   */
  public function getMenuName(array $data) {
    return isset($data['menu_name']) ? $data['menu_name'] : NULL;
  }

  /**
   * Get the machine name of a theme.
   *
   * @param array $data
   *   A decoded JSON object used to load the configuration.
   *
   * @return mixed
   *   An string or null.
   */
  public function getTheme(array $data) {
    return isset($data['theme']) ? $data['theme'] : NULL;
  }

  /**
   * Get an existing menu configuration.
   *
   * @param array $data
   *   A decoded JSON object used to load the configuration.
   *
   * @return mixed
   *   An array or null.
   */
  public function getMenuConfig(array $data) {
    return isset($data['menu_config']) ? $data['menu_config'] : NULL;
  }

  /**
   * Get an existing block configuration.
   *
   * @param array $data
   *   A decoded JSON object used to load the configuration.
   *
   * @return mixed
   *   An array or null.
   */
  public function getBlockConfig(array $data) {
    return isset($data['block_config']) ? $data['block_config'] : NULL;
  }

  /**
   * This is a menu page. To edit Mega Menu.
   */
  public function configMegaMenu(ConfigEntityInterface $tb_megamenu, Request $request) {
    // Add font-awesome library.
    $page['#attached']['library'][] = 'tb_megamenu/form.font-awesome';
    // Add chosen library.
    $page['#attached']['library'][] = 'tb_megamenu/form.chosen';
    // Add a custom library.
    $page['#attached']['library'][] = 'tb_megamenu/form.configure-megamenu';
    Url::fromRoute('tb_megamenu.admin.save', [], ['absolute' => TRUE]);

    $abs_url_config = Url::fromRoute('tb_megamenu.admin.save', [], ['absolute' => TRUE])->toString();
    $page['#attached']['drupalSettings']['TBMegaMenu']['saveConfigURL'] = $abs_url_config;
    if (!empty($tb_megamenu)) {
      $page['tb_megamenu'] = [
        '#theme' => 'tb_megamenu_backend',
        '#menu_name' => $tb_megamenu->menu,
        '#block_theme' => $tb_megamenu->theme,
      ];
    }
    return $page;
  }

}
