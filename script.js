const body = document.body;
const tabs = Array.from(document.querySelectorAll('.tab-dock [role="tab"]'));
const panels = Array.from(document.querySelectorAll('.tab-panels > [role="tabpanel"]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('img').forEach((img) => {
  if (!img.hasAttribute('fetchpriority')) {
    img.loading = 'lazy';
  }
  img.decoding = 'async';
});

const activateScopedTab = (tab, tabList, panelList) => {
  const target = tab.dataset.target;

  tabList.forEach((item) => {
    item.classList.toggle('is-active', item === tab);
  });

  panelList.forEach((panel) => {
    const active = panel.id === target;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
};

const activatePrimaryTab = (tab) => {
  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });

  panels.forEach((panel) => {
    const active = panel.id === tab.getAttribute('aria-controls');
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });

  body.dataset.theme = tab.dataset.theme || 'manha';
  tab.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'center'
  });
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activatePrimaryTab(tab));
});

document.querySelectorAll('.subtabs').forEach((group) => {
  const scopedTabs = Array.from(group.children).filter((child) => child.classList.contains('subtab'));
  const scopedPanels = scopedTabs
    .map((tab) => document.getElementById(tab.dataset.target))
    .filter(Boolean);

  scopedTabs.forEach((tab) => {
    tab.addEventListener('click', () => activateScopedTab(tab, scopedTabs, scopedPanels));
  });
});
