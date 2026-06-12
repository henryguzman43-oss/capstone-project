const startBtn = document.getElementById("startBtn");
const introScreen = document.getElementById("introScreen");
const pokedex = document.querySelector(".pokedex");

const searchBtn = document.getElementById("searchBtn");
const dpad = document.querySelector(".dpad");
const joystick = document.querySelector(".joystick");

const inputEl = document.getElementById("pokemonInput");

let currentPokemonId = 1;

// ======================
// INTRO
// ======================

pokedex.style.display = "none";

startBtn.onclick = () => {
  introScreen.classList.add("hideIntro");

  setTimeout(() => {
    introScreen.remove();

    pokedex.style.display = "flex";

    fetchPokemon(currentPokemonId);

    loadPokemonList();

  }, 1000);
};

// ======================
// FETCH POKEMON
// ======================

async function fetchPokemon(pokemon = 1) {

  try {

    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );

    if (!res.ok) {
      throw new Error("Pokemon not found");
    }

    const data = await res.json();

    currentPokemonId = data.id;

    // CLEAR INPUT
    inputEl.value = "";

    const img = document.getElementById("pokemonImage");
    const nameEl = document.getElementById("pokemonName");
    const screen = document.querySelector(".screen-container");

    // RESET ANIMATIONS
    img.style.animation = "none";
    nameEl.style.animation = "none";
    screen.classList.remove("flash");

    // FORCE REFLOW
    void img.offsetWidth;

    // APPLY ANIMATIONS
    img.style.animation = "pokeFadeIn 0.4s ease";
    nameEl.style.animation = "pokePop 0.3s ease";
    screen.classList.add("flash");

    // IMAGE
    img.src =
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default;

    // NAME
    nameEl.textContent =
      `#${data.id} ${capitalize(data.name)}`;

    // TYPES
    const types = document.getElementById("types");

    types.innerHTML = "";

    data.types.forEach(t => {

      const div = document.createElement("div");

      div.classList.add("type", t.type.name);

      div.textContent = t.type.name;

      types.appendChild(div);

    });

    // STATS
    const stats = document.getElementById("stats");

    stats.innerHTML = "";

    data.stats.forEach(s => {

      const div = document.createElement("div");

      div.classList.add("stat");

      div.textContent =
        `${capitalize(s.stat.name)}: ${s.base_stat}`;

      stats.appendChild(div);

    });

    // ======================
    // 🧠 NEW: POKÉDEX DESCRIPTION (ADDED ONLY)
    // ======================

    const descEl = document.getElementById("pokeDesc");

    try {

      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`
      );

      const speciesData = await speciesRes.json();

      const entry = speciesData.flavor_text_entries.find(
        e => e.language.name === "en"
      );

      descEl.textContent = entry
        ? entry.flavor_text.replace(/\f/g, " ")
        : "No Pokédex entry available.";

    } catch (err) {

      console.error("Description error", err);

      descEl.textContent =
        "Pokédex entry failed to load.";

    }

  } catch (err) {

    console.error(err);

    alert("Pokémon not found!");

  }
}

// ======================
// SEARCH
// ======================

searchBtn.onclick = () => {

  const value = inputEl.value
    .trim()
    .toLowerCase();

  if (value) {
    fetchPokemon(value);
  }
};

// ENTER KEY SEARCH

inputEl.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {

    const value = inputEl.value
      .trim()
      .toLowerCase();

    if (value) {
      fetchPokemon(value);
    }
  }
});

// ======================
// DPAD
// ======================

dpad.onclick = (e) => {

  const rect = dpad.getBoundingClientRect();

  const x = e.clientX - rect.left;

  // LEFT SIDE
  if (x < rect.width / 2) {

    currentPokemonId--;

  } else {

    currentPokemonId++;

  }

  // LOOP IDs
  if (currentPokemonId < 1) {
    currentPokemonId = 1025;
  }

  if (currentPokemonId > 1025) {
    currentPokemonId = 1;
  }

  fetchPokemon(currentPokemonId);
};

// ======================
// RANDOMIZER
// ======================

joystick.onclick = () => {

  let i = 0;

  const spin = setInterval(() => {

    const randomId =
      Math.floor(Math.random() * 1025) + 1;

    fetchPokemon(randomId);

    i++;

    if (i > 6) {

      clearInterval(spin);

    }

  }, 80);
};

// ======================
// AUTOCOMPLETE
// ======================

async function loadPokemonList() {

  try {

    const res = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1302"
    );

    const data = await res.json();

    const list = document.getElementById("pokemonList");

    data.results.forEach(p => {

      const opt = document.createElement("option");

      opt.value = p.name;

      list.appendChild(opt);

    });

  } catch (err) {

    console.error(
      "Failed loading pokemon list",
      err
    );

  }
}

// ======================
// HELPERS
// ======================

function capitalize(str) {

  return str.charAt(0).toUpperCase() +
         str.slice(1);

}


// ur code is genuine BUNS!!!
// the person above me is lying, this is so peak im crying 

// ======================
// BLUE GRID LIGHTS
// ======================

const gridSquares =
  document.querySelectorAll(".blue-grid div");

function animateGrid(){

  // clear previous lights
  gridSquares.forEach(square => {
    square.classList.remove("active");
  });

  // random glowing squares
  const glowCount =
    Math.floor(Math.random() * 4) + 2;

  for(let i = 0; i < glowCount; i++){

    const randomIndex =
      Math.floor(Math.random() * gridSquares.length);

    gridSquares[randomIndex]
      .classList.add("active");
  }
}

// animate forever
setInterval(animateGrid, 300);



setInterval(() => {
  document.querySelectorAll(".blue-grid div").forEach(s => s.classList.remove("active"));

  const squares = document.querySelectorAll(".blue-grid div");

  for (let i = 0; i < 3; i++) {
    squares[Math.floor(Math.random() * squares.length)]
      .classList.add("active");
  }

  document.querySelectorAll(".small-btn").forEach(b => b.classList.remove("active"));

  const btns = document.querySelectorAll(".small-btn");
  btns[Math.floor(Math.random() * btns.length)].classList.add("active");

}, 400);
