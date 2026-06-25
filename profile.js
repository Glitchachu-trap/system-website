function getQueryParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getAlterByName(name) {
  return alters.find((alter) => alter.name.toLowerCase() === name?.toLowerCase());
}

function getSavedProfile(name) {
  if (!name) return null;
  try {
    return JSON.parse(localStorage.getItem(`alter-profile-${name}`)) || null;
  } catch {
    return null;
  }
}

function saveProfile(name, profile) {
  localStorage.setItem(`alter-profile-${name}`, JSON.stringify(profile));
}

function resetProfile(name) {
  localStorage.removeItem(`alter-profile-${name}`);
}

function getSpotifyEmbedUrl(url) {
  try {
    const match = url.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([A-Za-z0-9]+)/);
    return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
  } catch {
    return null;
  }
}

function createCollageMediaItem(item) {
  if (item.type === "image") {
    return `
      <article class="collage-card collage-image">
        <img src="${item.src}" alt="Collage image" />
      </article>
    `;
  }

  const spotifyEmbed = getSpotifyEmbedUrl(item.src);
  const title = item.title || item.label || "Music";
  const author = item.author ? `<p class="audio-meta-author">${item.author}</p>` : "";
  const cover = item.cover
    ? `<div class="audio-cover"><img src="${item.cover}" alt="Cover for ${title}" /></div>`
    : "";

  return `
    <article class="collage-card collage-audio">
      ${cover}
      <div class="audio-card-body">
        <p class="audio-meta-title">${title}</p>
        ${author}
        ${spotifyEmbed ? `
          <iframe class="audio-embed" src="${spotifyEmbed}" width="100%" height="120" frameborder="0" allow="encrypted-media"></iframe>
        ` : `
          <audio controls src="${item.src}">Your browser does not support audio playback.</audio>
        `}
      </div>
    </article>
  `;
}

const CREATOR_KEY = "alter-gallery-creator";
const CREATOR_SECRET = "7RingSys";

function isCreator() {
  return localStorage.getItem(CREATOR_KEY) === "true";
}

function setCreatorAccess(value) {
  if (value) {
    localStorage.setItem(CREATOR_KEY, "true");
  } else {
    localStorage.removeItem(CREATOR_KEY);
  }
}

function updateCreatorUI() {
  const editor = document.getElementById("profileEditor");
  const creatorStatus = document.getElementById("creatorStatus");
  const loginBtn = document.getElementById("creatorLoginBtn");
  const logoutBtn = document.getElementById("creatorLogoutBtn");

  if (isCreator()) {
    editor.classList.remove("hidden");
    creatorStatus.textContent = "Creator access granted. Customize this profile now.";
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    editor.classList.add("hidden");
    creatorStatus.textContent = "Creator access required to customize this profile.";
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }
}

function requestCreatorLogin() {
  const code = prompt("Enter creator passphrase to access customization:");
  if (code === null) return;
  if (code === CREATOR_SECRET) {
    setCreatorAccess(true);
    updateCreatorUI();
    alert("Creator access granted.");
  } else {
    alert("Incorrect passphrase.");
  }
}

function renderProfile() {
  const alterName = getQueryParameter("alter");
  const alter = getAlterByName(alterName);
  const profileName = document.getElementById("profileName");
  const profileRole = document.getElementById("profileRole");
  const profileDescription = document.getElementById("profileDescription");
  const profileImagePreview = document.getElementById("profileImagePreview");
  const bioInput = document.getElementById("bioInput");
  const imageUrlInput = document.getElementById("imageUrlInput");
  const musicUrlInput = document.getElementById("musicUrlInput");
  const musicTitleInput = document.getElementById("musicTitleInput");
  const musicAuthorInput = document.getElementById("musicAuthorInput");
  const musicCoverInput = document.getElementById("musicCoverInput");
  const collageArea = document.getElementById("collageArea");
  const creatorLoginBtn = document.getElementById("creatorLoginBtn");
  const creatorLogoutBtn = document.getElementById("creatorLogoutBtn");
  const profileEditor = document.getElementById("profileEditor");

  if (!alter) {
    profileName.textContent = "Alter not found";
    profileRole.textContent = "Choose a valid profile from the gallery.";
    profileDescription.textContent = "Return to the main page and select a profile button.";
    profileImagePreview.src = "https://picsum.photos/seed/unknown/800/600";
    return;
  }

  const saved = getSavedProfile(alter.name);
  profileName.textContent = alter.name;
  profileRole.textContent = alter.role;
  profileDescription.textContent = saved?.bio || alter.description;
  profileImagePreview.src = saved?.image || alter.image;
  bioInput.value = saved?.bio || "";

  const mediaItems = saved?.media || [];
  collageArea.innerHTML = mediaItems.map(createCollageMediaItem).join("");

  creatorLoginBtn.addEventListener("click", () => {
    requestCreatorLogin();
  });

  creatorLogoutBtn.addEventListener("click", () => {
    setCreatorAccess(false);
    updateCreatorUI();
    alert("Creator access revoked.");
  });

  updateCreatorUI();

  function ensureCreator() {
    if (!isCreator()) {
      alert("Only the website creator can customize this profile.");
      return false;
    }
    return true;
  }

  document.getElementById("saveProfileBtn").addEventListener("click", () => {
    if (!ensureCreator()) return;
    const newMedia = mediaItems.slice();
    const profileData = {
      bio: bioInput.value,
      image: profileImagePreview.src,
      media: newMedia,
    };
    saveProfile(alter.name, profileData);
    profileDescription.textContent = bioInput.value || alter.description;
    alert("Profile saved locally.");
  });

  document.getElementById("resetProfileBtn").addEventListener("click", () => {
    if (!ensureCreator()) return;
    resetProfile(alter.name);
    location.reload();
  });

  document.getElementById("addImageBtn").addEventListener("click", (event) => {
    event.preventDefault();
    if (!ensureCreator()) return;
    const url = imageUrlInput.value.trim();
    if (!url) return;
    mediaItems.push({ type: "image", src: url });
    collageArea.innerHTML = mediaItems.map(createCollageMediaItem).join("");
    imageUrlInput.value = "";
  });

  document.getElementById("addMusicBtn").addEventListener("click", (event) => {
    event.preventDefault();
    if (!ensureCreator()) return;
    const url = musicUrlInput.value.trim();
    if (!url) return;
    const title = musicTitleInput.value.trim();
    const author = musicAuthorInput.value.trim();
    const cover = musicCoverInput.value.trim();

    mediaItems.push({
      type: "audio",
      src: url,
      title: title || `Music for ${alter.name}`,
      author: author || "",
      cover: cover || "",
      label: `Audio for ${alter.name}`,
    });

    collageArea.innerHTML = mediaItems.map(createCollageMediaItem).join("");
    musicUrlInput.value = "";
    musicTitleInput.value = "";
    musicAuthorInput.value = "";
    musicCoverInput.value = "";
  });
}

renderProfile();
