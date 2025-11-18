document.addEventListener("DOMContentLoaded", function () {
  const tags = document.querySelectorAll(".tag");
  const courseCards = document.querySelectorAll(".course-card");
  const starIcons = document.querySelectorAll(".star");

  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      tags.forEach((t) => t.classList.remove("active"));
      tag.classList.add("active");

      const selected = tag.textContent.trim();

      courseCards.forEach((card) => {
        const courseText = card.textContent;
        if (selected === "Light Workload") {
          card.style.display = courseText.includes("ECON1020") ? "flex" : "none";
        } else if (selected === "Group Projects") {
          card.style.display = courseText.includes("PSYC1030") ? "flex" : "none";
        } else if (selected === "Label") {
          card.style.display = courseText.includes("MATH1040") ? "flex" : "none";
        } else {
          card.style.display = "flex";
        }
      });
    });
  });

  starIcons.forEach((star) => {
    star.addEventListener("click", () => {
      star.classList.toggle("starred");
      star.textContent = star.classList.contains("starred") ? "★" : "☆";
    });
  });
});