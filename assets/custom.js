/* Santhosh: Custom JS */

/**
 * Custom Base Class
 * @extends {HTMLElement}
 */
class CustomBase extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * Set a cookie
   * @param {string} name - The name of the cookie
   * @param {string} value - The value of the cookie
   * @param {number} days - The number of days to store the cookie
   */
  setCookie(name, value, days=365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
  }
  
  /**
   * Get a cookie
   * @param {string} name - The name of the cookie
   * @param {string} defaultValue - The default value to return if the cookie is not found
   * @returns {string} The value of the cookie
   */
  getCookie(name, defaultValue="") {
    const cname = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let c of ca) {
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return defaultValue;
  }

  /**
   * Delete a cookie
   * @param {string} name - The name of the cookie
   */
  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

/**
 * Custom Header Menu Class
 * @extends {CustomBase}
 */
class CustomHeaderMenu extends CustomBase {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setupDropdowns();
  }

  setupDropdowns() {
    // Attach event listeners to all menu items with submenus
    const menuItems = this.querySelectorAll('.custom-header-menu__list-item');
    menuItems.forEach((item) => {
      const submenu = item.querySelector('.custom-header__dropdown-menu');
      if (submenu) {
        // Show submenu on mouseenter/focus
        item.addEventListener('mouseenter', () => this.openDropdown(/** @type {HTMLElement} */(item)));
        item.addEventListener('focusin', () => this.openDropdown(/** @type {HTMLElement} */(item)));
        // Hide submenu on mouseleave/blur
        item.addEventListener('mouseleave', () => this.closeDropdown(/** @type {HTMLElement} */(item)));
        item.addEventListener('focusout', (e) => {
          /** @type {FocusEvent} */
          const fe = /** @type {FocusEvent} */ (e);
          // Only close if focus moves outside the item
          if (!item.contains(/** @type {Node} */(fe.relatedTarget))) {
            this.closeDropdown(/** @type {HTMLElement} */(item));
          }
        });

        const subMenuItems = item.querySelectorAll('.custom-header-dropdown-menu__item');
        subMenuItems.forEach((subItem) => {
          const submenu = subItem.querySelector('.custom-header-dropdown-menu__submenu');
          if (submenu) {
            // Show submenu on mouseenter/focus
            subItem.addEventListener('mouseenter', () => this.openDropdownSubmenu(/** @type {HTMLElement} */(subItem)));
            subItem.addEventListener('focusin', () => this.openDropdownSubmenu(/** @type {HTMLElement} */(subItem)));
            // Hide submenu on mouseleave/blur
            subItem.addEventListener('mouseleave', () => this.closeDropdown(/** @type {HTMLElement} */(subItem)));
            subItem.addEventListener('focusout', (e) => {
              /** @type {FocusEvent} */
              const fe = /** @type {FocusEvent} */ (e);
              // Only close if focus moves outside the item
              if (!subItem.contains(/** @type {Node} */(fe.relatedTarget))) {
                this.closeDropdown(/** @type {HTMLElement} */(subItem));
              }
            });
          }
        });
      }
    });
  }

  /**
   * Open dropdown for a menu item and center it under the link
   * @param {HTMLElement} item
   */
  openDropdown(item) {
    item.classList.add('dropdown-open');
    const submenu = item.querySelector('.custom-header__dropdown-menu');
    if (submenu && submenu instanceof HTMLElement) {
      submenu.classList.add('dropdown-visible');

      // Center the dropdown under the link
      const link = item.querySelector('.custom-header-menu__link');
      if (link && submenu.classList.contains('custom-header__dropdown-menu')) {
        // Reset left to auto before calculation
        submenu.style.left = 'auto';

        // Get bounding rectangles
        const linkRect = link.getBoundingClientRect();
        const submenuRect = submenu.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        // Calculate the left offset so the dropdown is centered under the link
        let left = (linkRect.width / 2) - (submenuRect.width / 2);
        if (windowWidth < submenuRect.right) {
          left -= (submenuRect.right - windowWidth) / 2;
        }

        // If the dropdown is too far left, set it to 0
        if ((linkRect.left + left) < 0) {
          left = -linkRect.left + 1;
        }

        submenu.style.left = `${left}px`;
      }
    }
  }

  /**
   * Open dropdown for a menu item and center it under the link
   * @param {HTMLElement} item
   */
  openDropdownSubmenu(item) {
    item.classList.add('dropdown-open');
    const submenu = item.querySelector('.custom-header-dropdown-menu__submenu');
    if (submenu && submenu instanceof HTMLElement) {
      submenu.classList.add('dropdown-visible');

      // right or left align the dropdown
      const link = item.querySelector('.custom-header-dropdown-menu__link');
      if (link && submenu.classList.contains('custom-header-dropdown-menu__submenu')) {
        // Reset left to auto before calculation
        submenu.style.left = '100%';

        // Get bounding rectangles
        const linkRect = link.getBoundingClientRect();
        const submenuRect = submenu.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        // If the dropdown is too far right, set it to 0
        if ((windowWidth < submenuRect.right) || submenu.classList.contains('dropdown-reverse')) {
          submenu.style.left = `-${linkRect.width}px`;
          submenu.classList.add('dropdown-reverse');
          submenu.querySelectorAll(".custom-header-dropdown-menu__submenu").forEach((submenu1) => {
            submenu1.classList.add('dropdown-reverse');
          });
        }
      }
    }
  }

  /**
   * Close dropdown for a menu item
   * @param {HTMLElement} item
   */
  closeDropdown(item) {
    item.classList.remove('dropdown-open');
    const submenu = item.querySelector('.custom-header__dropdown-menu, .custom-header-dropdown-menu__submenu');
    if (submenu) {
      submenu.classList.remove('dropdown-visible');
    }
  }
}

customElements.define('custom-header-menu', CustomHeaderMenu);