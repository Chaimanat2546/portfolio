// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'index',
    {
      type: 'category',
      label: '🚀 เริ่มต้นใช้งาน',
      items: [
        'getting-started/requirements',
        'getting-started/installation',
        'getting-started/first-login',
      ],
    },
    {
      type: 'category',
      label: '📖 ฟีเจอร์หลัก',
      items: [
        'features/dashboard',
        'features/user-management',
        'features/settings',
      ],
    },
    {
      type: 'category',
      label: '📸 คู่มือภาพประกอบ',
      items: [
        'screenshots/overview',
        'screenshots/step-by-step',
        'screenshots/troubleshooting',
      ],
    },
    'faq',
    'contact',
  ],
};

export default sidebars;
