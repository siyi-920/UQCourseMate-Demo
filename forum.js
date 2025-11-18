const pages = {
  popular: document.getElementById("popularPage"),
  search: document.getElementById("searchPage"),
  forum: document.getElementById("forumPage"),
  treehole: document.getElementById("treeholePage"),
  profile: document.getElementById("profilePage"),
  postDetail: document.getElementById("postDetailPage"), 
};

const title = document.getElementById("pageTitle");
const backButton = document.getElementById("backButton");
const logoutBtn = document.getElementById("logoutBtn");

let historyStack = ["forum"]; // start on forum as the root
let isLoginMode = false; // no login UI but keep var unused for safety

function showPage(pageName) {
  Object.values(pages).forEach(p => p && p.classList.remove("active"));
  if (!pages[pageName]) {
    console.error("showPage: unknown page", pageName);
    return;
  }
  pages[pageName].classList.add("active");

  const titles = {
    popular: "Popular Courses",
    search: "Search",
    forum: "Forum",
    treehole: "Treehole",
    profile: "My Profile",
    // do not override header title for postDetail (title set in HTML)
  };
  if (titles[pageName]) title.textContent = titles[pageName];

  // hide back button on forum (was signup previously)
  backButton.style.display = pageName === "forum" ? "none" : "block";
}

// removed saveUser/getUser/handleSignUpOrLogin and toggleMode/signUp handlers

backButton.addEventListener("click", () => {
  if (historyStack.length > 1) {
    historyStack.pop();
    const prev = historyStack[historyStack.length - 1];
    showPage(prev);
  }
});

// menu-item navigation: some elements may point to pages (data-target="forumPage" etc.)
document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-target").replace("Page", "");
    historyStack.push(target);
    showPage(target);
  });
});

// post-card opens post detail
document.querySelectorAll(".posts .post-card").forEach((card) => {
  card.addEventListener("click", () => {
    historyStack.push("postDetail");
    showPage("postDetail");
  });
});

// logout returns to forum root (no signup page)
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // clear any stored session if present and return to forum
    localStorage.removeItem("loggedInUser");
    historyStack = ["forum"];
    showPage("forum");
  });
}

// Start app on forum
showPage("forum");

// --- Tag selection / filtering logic (unchanged) ---
const masterTagButtons = document.querySelectorAll(".forum-tags .tag");
const selectedTagsContainer = document.getElementById("selectedTagsContainer");
const logicToggle = document.getElementById("logicToggle");
let selectedTags = [];
let logicMode = "or"; // 'or' or 'and'

function refreshPostsByTags() {
  const posts = document.querySelectorAll(".post-card");
  posts.forEach(post => {
    const postTagElems = Array.from(post.querySelectorAll(".post-tags .tag"));
    const postTags = postTagElems.map(t => t.dataset.tag);
    if (selectedTags.length === 0) {
      post.style.display = "";
      return;
    }

    if (logicMode === "or") {
      const visible = postTags.some(t => selectedTags.includes(t));
      post.style.display = visible ? "" : "none";
    } else {
      // 'and' - show posts that contain ALL selected tags (not exact-match)
      const postSet = new Set(postTags);
      const selSet = new Set(selectedTags);
      const allMatch = [...selSet].every(tag => postSet.has(tag));
      post.style.display = allMatch ? "" : "none";
    }
  });

  // update logic UI
  if (logicToggle) logicToggle.textContent = logicMode;
}

function renderSelectedTags() {
  if (!selectedTagsContainer) return;
  selectedTagsContainer.innerHTML = "";
  selectedTags.forEach(tagName => {
    // find master to copy its colour class
    const master = Array.from(masterTagButtons).find(b => b.dataset.tag === tagName);

    const btn = document.createElement("button");
    // preserve original colour class from master (if found) and add selected-tag
    if (master) {
      // master.className might be like "tag tag-lorem", preserve it
      btn.className = master.className + " selected-tag";
    } else {
      btn.className = "tag selected-tag";
    }
    btn.textContent = tagName;
    btn.dataset.tag = tagName;

    // clicking selected tag removes it and reveals master tag again
    btn.addEventListener("click", () => {
      removeSelectedTag(tagName);
      if (master) master.style.display = "";
    });

    selectedTagsContainer.appendChild(btn);

    // hide master counterpart
    if (master) master.style.display = "none";
  });

  refreshPostsByTags();
}

function addSelectedTag(tagName) {
  if (!selectedTags.includes(tagName)) {
    selectedTags.push(tagName);
    renderSelectedTags();
  }
}

function removeSelectedTag(tagName) {
  selectedTags = selectedTags.filter(t => t !== tagName);
  renderSelectedTags();
}

// wire master tag clicks
masterTagButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tag = btn.dataset.tag;
    addSelectedTag(tag);
  });
});

// toggle logic mode
if (logicToggle) {
  logicToggle.addEventListener("click", () => {
    logicMode = logicMode === "or" ? "and" : "or";
    refreshPostsByTags();
  });
}

// initialize (ensure posts visible)
refreshPostsByTags();
