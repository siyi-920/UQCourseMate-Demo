// --------- Data (20 courses) ----------
const COURSES_INTEREST = [
  {code:"CSSE1001", name:"Introduction to Software Engineering"},
  {code:"CSSE2002", name:"Programming in the Large"},
  {code:"CSSE2010", name:"Digital Systems"},
  {code:"CSSE2310", name:"Computer Systems Principles"},
  {code:"INFS1200", name:"Introduction to Information Systems"},
  {code:"INFS2200", name:"Relational Databases"},
  {code:"INFS7903", name:"Advanced Databases"},
  {code:"DECO1400", name:"Intro to Web Design"},
  {code:"DECO1800", name:"Design Studio"},
  {code:"ECON1020", name:"Macroeconomic Policy"}
];

const COURSES_PEERS = [
  {code:"MATH1051", name:"Calculus & Linear Algebra I"},
  {code:"MATH1052", name:"Calculus & Linear Algebra II"},
  {code:"STAT1201", name:"Analysis of Scientific Data"},
  {code:"PHYS1001", name:"Mechanics & Thermal Physics"},
  {code:"CHEM1100", name:"Chemistry 1"},
  {code:"BIOL1040", name:"Genetics, Evolution & Ecology"},
  {code:"ACCT1101", name:"Accounting for Decision Making"},
  {code:"MGTS1301", name:"Introduction to Management"},
  {code:"PSYC1030", name:"Introductory Psychology"},
  {code:"COMP3506", name:"Algorithms & Data Structures"}
];

// --------- DOM helpers ----------
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const tpl = $("#tile-tpl");

// --------- Render ----------
function renderList(container, data){
  container.innerHTML = "";
  data.forEach(item => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.textContent = item.code;
    node.title = `${item.code} — ${item.name}`;
    node.dataset.code = item.code.toLowerCase();
    node.dataset.name = item.name.toLowerCase();
    node.addEventListener("click", () => {
      alert(`${item.code}\n${item.name}`);
      // TODO: navigate to course detail page
    });
    container.appendChild(node);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderList($("#list-interest"), COURSES_INTEREST);
  renderList($("#list-peers"), COURSES_PEERS);

  const input = $("#q");
  const clearBtn = $("#clear");

  function applyFilter(){
    const q = input.value.trim().toLowerCase();
    const tiles = $$(".tile");
    let shown = 0;
    tiles.forEach(t => {
      const hit = t.dataset.code.includes(q) || t.dataset.name.includes(q);
      t.style.display = hit ? "" : "none";
      if (hit) shown++;
    });
    // optional: show a small empty state
    if (!$("#empty")) {
      const p = document.createElement("p");
      p.id = "empty"; p.style.color = "#6b7280"; p.style.margin = "12px 4px";
      p.textContent = "No matching courses.";
      $(".content").appendChild(p);
    }
    $("#empty").style.display = shown ? "none" : "";
  }

  input.addEventListener("input", applyFilter);
  clearBtn.addEventListener("click", () => { input.value = ""; applyFilter(); input.focus(); });

  // Accessibility: Enter focuses first match
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const first = $$(".tile").find(t => t.style.display !== "none");
      if (first) first.focus();
    }
  });
});