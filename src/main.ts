import { Launcher, type Shortcut } from './Launcher';
import { Navigator } from './Navigator';

const grid = document.getElementById('app-grid') as HTMLElement;
const greetingEl = document.getElementById('greeting') as HTMLElement;
const clockEl = document.getElementById('clock') as HTMLElement;
// const dateEl = document.getElementById('date') as HTMLElement;
const settingsBtn = document.getElementById('settings-btn') as HTMLElement;

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay') as HTMLElement;
const modalTitle = document.getElementById('modal-title') as HTMLElement;
const urlInput = document.getElementById('url-input') as HTMLInputElement;
const titleInput = document.getElementById('title-input') as HTMLInputElement;
const logoInput = document.getElementById('logo-input') as HTMLInputElement;
const saveBtn = document.getElementById('save-btn') as HTMLElement;
const cancelBtn = document.getElementById('cancel-btn') as HTMLElement;

const launcher = new Launcher();
let navigator: Navigator;
let shortcuts: Shortcut[] = [];
let isEditMode = false;
let editingId: string | null = null; // Track if we are editing an existing shortcut

// --- Rendering ---

function renderGrid(items: Shortcut[]) {
  grid.innerHTML = '';

  // Render Shortcuts
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.dataset.index = index.toString();

    // Icon handling
    const iconUrl = item.icon || '/vite.svg';

    // Edit/Delete Badges
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'badge-container';
    badgeContainer.style.display = 'none'; // Controlled by CSS generally, but explicit here too

    if (isEditMode) {
      // Delete Badge
      const deleteBadge = document.createElement('div');
      deleteBadge.className = 'delete-badge';
      deleteBadge.innerText = 'X';
      deleteBadge.onclick = (e) => {
        e.stopPropagation();
        deleteShortcut(item.id);
      };

      // Edit Badge (Pencil)
      const editBadge = document.createElement('div');
      editBadge.className = 'edit-badge';
      editBadge.innerText = '✎';
      editBadge.onclick = (e) => {
        e.stopPropagation();
        openEditModal(item);
      };

      badgeContainer.appendChild(editBadge);
      badgeContainer.appendChild(deleteBadge);
      badgeContainer.style.display = 'flex';
    }

    card.innerHTML = `
      <img src="${iconUrl}" alt="${item.title}" onerror="this.src='/vite.svg'">
      <span>${item.title}</span>
    `;
    card.appendChild(badgeContainer);

    card.onclick = () => {
      if (!isEditMode) launchApp(index);
      // In edit mode, clicking the card body does nothing (badges handle actions)
    };

    grid.appendChild(card);
  });

  // Render "Add New" Card if in Edit Mode
  if (isEditMode) {
    const addCard = document.createElement('div');
    addCard.className = 'app-card add-card';
    addCard.innerHTML = `<span>+</span>`;
    addCard.onclick = () => openAddModal();
    grid.appendChild(addCard);
  }
}

function updateFocus(index: number) {
  const cards = document.querySelectorAll('.app-card');
  cards.forEach(c => c.classList.remove('focused'));

  if (cards[index]) {
    cards[index].classList.add('focused');
    (cards[index] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function launchApp(index: number) {
  if (isEditMode) return;
  const item = shortcuts[index];
  if (item) {
    window.location.href = item.url;
  }
}

// --- Edit Mode Logic ---

function toggleEditMode() {
  isEditMode = !isEditMode;
  document.body.classList.toggle('edit-mode', isEditMode);

  // Toggle Greeting Editability
  if (isEditMode) {
    greetingEl.contentEditable = 'true';
    greetingEl.classList.add('editable');
    greetingEl.focus();
  } else {
    greetingEl.contentEditable = 'false';
    greetingEl.classList.remove('editable');
    // Save greeting on exit
    launcher.saveGreeting(greetingEl.textContent);
  }

  renderGrid(shortcuts);
  const count = isEditMode ? shortcuts.length + 1 : shortcuts.length;
  navigator.setItems(count, getGridColumns());
}

async function deleteShortcut(id: string) {
  if (!confirm('Delete shortcut?')) return;
  launcher.removeShortcut(id);
  shortcuts = launcher.getShortcuts();
  renderGrid(shortcuts);
  navigator.setItems(isEditMode ? shortcuts.length + 1 : shortcuts.length, getGridColumns());
}

function openAddModal() {
  editingId = null;
  modalTitle.innerText = 'Add Shortcut';
  urlInput.value = '';
  titleInput.value = '';
  logoInput.value = '';

  modalOverlay.classList.add('open');
  urlInput.focus();
}

function openEditModal(item: Shortcut) {
  editingId = item.id;
  modalTitle.innerText = 'Edit Shortcut';
  urlInput.value = item.url;
  titleInput.value = item.title;
  logoInput.value = item.icon || '';

  modalOverlay.classList.add('open');
  urlInput.focus(); // Or title?
}

function closeAddModal() {
  modalOverlay.classList.remove('open');
}

async function saveShortcut() {
  const urlStr = urlInput.value.trim();
  if (!urlStr) return;

  const safeUrl = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
  let title = titleInput.value.trim();
  const manualLogo = logoInput.value.trim();
  let icon = manualLogo;

  // Auto-fetch if needed
  if (!title || (!icon && !manualLogo)) {
    const meta = await launcher.getMetadata(safeUrl);
    if (!title) title = meta.title;
    if (!icon) icon = meta.icon;
  }

  if (editingId) {
    // Update existing
    const updated: Shortcut = {
      id: editingId,
      title,
      url: safeUrl,
      icon
    };
    launcher.updateShortcut(updated);
  } else {
    // Create new
    const newShortcut: Shortcut = {
      id: Date.now().toString(),
      title,
      url: safeUrl,
      icon
    };
    launcher.addShortcut(newShortcut);
  }

  shortcuts = launcher.getShortcuts();
  closeAddModal();
  renderGrid(shortcuts);
  navigator.setItems(isEditMode ? shortcuts.length + 1 : shortcuts.length, getGridColumns());
}

// --- Layout Helpers ---

function getGridColumns() {
  if (window.innerWidth <= 600) return 2;
  if (window.innerWidth <= 900) return 3;
  return 4;
}

function handleResize() {
  if (navigator) {
    const count = isEditMode ? shortcuts.length + 1 : shortcuts.length;
    navigator.setItems(count, getGridColumns());
  }
}

// --- Clock & Greeting ---

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const hour = now.getHours();
  let greetTime = 'Good Evening';
  if (hour < 12) greetTime = 'Good Morning';
  else if (hour < 18) greetTime = 'Good Afternoon';

  // Use custom greeting if set, otherwise default structure
  const custom = launcher.getGreeting();
  if (custom && custom.trim() !== '') {
    // Keep custom greeting as is
    // But maybe the user wants dynamic "Good Morning, [Name]"?
    // For now, if custom is set, we respect it 100%. 
    // The user said "add custom text", likely overriding the whole thing or just the name.
    // Let's assume they edit the whole H1.
    // Only update if NOT currently editing
    if (!isEditMode && document.activeElement !== greetingEl) {
      greetingEl.textContent = custom;
    }
  } else {
    if (!isEditMode) greetingEl.textContent = `${greetTime}, User`;
  }
}

// --- Initialization ---

async function init() {
  shortcuts = await launcher.loadShortcuts();
  const savedGreeting = await launcher.loadGreeting();

  renderGrid(shortcuts);

  navigator = new Navigator(updateFocus, launchApp);
  navigator.setItems(shortcuts.length, getGridColumns());
  updateFocus(0);

  window.addEventListener('resize', handleResize);

  settingsBtn.addEventListener('click', toggleEditMode);
  cancelBtn.addEventListener('click', closeAddModal);
  saveBtn.addEventListener('click', saveShortcut);

  urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') titleInput.focus(); });
  titleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') logoInput.focus(); });
  logoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveShortcut(); });

  if (savedGreeting) greetingEl.textContent = savedGreeting;

  updateClock();
  setInterval(updateClock, 60000);
}

init();
