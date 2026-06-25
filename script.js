function renderAlters() {
  const container = document.getElementById("alterCards");
  container.innerHTML = alters.map((alter) => `
    <article class="card">
      <img src="${alter.image}" alt="Portrait of ${alter.name}" />
      <div class="card-body">
        <h3>${alter.name}</h3>
        <p class="badge">${alter.role}</p>
        <p>${alter.description}</p>
        <a href="profile.html?alter=${encodeURIComponent(alter.name)}" class="button card-button">Open profile</a>
      </div>
    </article>
  `).join("");
}

function renderArtGallery() {
  const gallery = document.getElementById("artGallery");
  gallery.innerHTML = artPieces.map((piece) => `
    <article class="art-card">
      <img src="${piece.image}" alt="Artwork titled ${piece.title}" />
      <div class="art-card-body">
        <h3>${piece.title}</h3>
        <p class="badge">${piece.artist}</p>
        <p>${piece.description}</p>
      </div>
    </article>
  `).join("");
}

renderAlters();
renderArtGallery();
