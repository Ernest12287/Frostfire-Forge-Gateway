import { inventoryUI, spellBookUI, friendsListUI, guildContainer, collectablesUI } from "./ui.js";

let toggleInventory = false;
let toggleSpellBook = false;
let toggleFriendsList = false;
let toggleGuild = false;
let toggleCollectables = false;

const mobileInventoryBtn = document.getElementById('mobile-inventory-button');
const mobileSpellbookBtn = document.getElementById('mobile-spellbook-button');
const mobileCollectablesBtn = document.getElementById('mobile-collectables-button');
const mobileFriendsBtn = document.getElementById('mobile-friends-button');
const mobileGuildBtn = document.getElementById('mobile-guild-button');
const mobileBackdrop = document.getElementById('mobile-ui-backdrop');

const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

function updateOverlay() {
  const anyOpen = toggleInventory || toggleSpellBook || toggleFriendsList || toggleGuild || toggleCollectables;
  if (isTouchDevice && mobileBackdrop) {
    if (anyOpen) {
      mobileBackdrop.classList.add('active');
    } else {
      mobileBackdrop.classList.remove('active');
    }
  }
}

function togglePanel(panel: HTMLElement, isOpen: boolean): boolean {
  if (isTouchDevice) {
    if (isOpen) {
      panel.classList.remove('open');
    } else {
      panel.classList.add('open');
    }
  } else {
    if (isOpen) {
      panel.style.right = panel === inventoryUI ? '-350px' : '-450px';
    } else {
      panel.style.right = '25px';
    }
  }
  return !isOpen;
}

function closeOtherPanels(except: string) {
  if (except !== 'inventory' && toggleInventory) {
    toggleInventory = togglePanel(inventoryUI, toggleInventory);
    mobileInventoryBtn?.classList.remove('active');
  }
  if (except !== 'spellbook' && toggleSpellBook) {
    toggleSpellBook = togglePanel(spellBookUI, toggleSpellBook);
    mobileSpellbookBtn?.classList.remove('active');
  }
  if (except !== 'collectables' && toggleCollectables) {
    toggleCollectables = togglePanel(collectablesUI, toggleCollectables);
    mobileCollectablesBtn?.classList.remove('active');
  }
  if (except !== 'friends' && toggleFriendsList) {
    toggleFriendsList = togglePanel(friendsListUI, toggleFriendsList);
    mobileFriendsBtn?.classList.remove('active');
  }
  if (except !== 'guild' && toggleGuild) {
    toggleGuild = togglePanel(guildContainer, toggleGuild);
    mobileGuildBtn?.classList.remove('active');
  }
}

mobileInventoryBtn?.addEventListener('click', () => {
  closeOtherPanels('inventory');
  toggleInventory = togglePanel(inventoryUI, toggleInventory);
  if (toggleInventory) {
    mobileInventoryBtn.classList.add('active');
  } else {
    mobileInventoryBtn.classList.remove('active');
  }
  updateOverlay();
});

mobileSpellbookBtn?.addEventListener('click', () => {
  closeOtherPanels('spellbook');
  toggleSpellBook = togglePanel(spellBookUI, toggleSpellBook);
  if (toggleSpellBook) {
    mobileSpellbookBtn.classList.add('active');
  } else {
    mobileSpellbookBtn.classList.remove('active');
  }
  updateOverlay();
});

mobileCollectablesBtn?.addEventListener('click', () => {
  closeOtherPanels('collectables');
  toggleCollectables = togglePanel(collectablesUI, toggleCollectables);
  if (toggleCollectables) {
    mobileCollectablesBtn.classList.add('active');
  } else {
    mobileCollectablesBtn.classList.remove('active');
  }
  updateOverlay();
});

mobileFriendsBtn?.addEventListener('click', () => {
  closeOtherPanels('friends');
  toggleFriendsList = togglePanel(friendsListUI, toggleFriendsList);
  if (toggleFriendsList) {
    mobileFriendsBtn.classList.add('active');
  } else {
    mobileFriendsBtn.classList.remove('active');
  }
  updateOverlay();
});

mobileGuildBtn?.addEventListener('click', () => {
  closeOtherPanels('guild');
  toggleGuild = togglePanel(guildContainer, toggleGuild);
  if (toggleGuild) {
    mobileGuildBtn.classList.add('active');
  } else {
    mobileGuildBtn.classList.remove('active');
  }
  updateOverlay();
});

mobileBackdrop?.addEventListener('click', () => {
  if (isTouchDevice) {
    closeOtherPanels('none');
    updateOverlay();
  }
});
