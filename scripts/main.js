import { writings } from "./data.js";

const cards = document.querySelectorAll(".writing-card");
const pageNumber = document.getElementById("pageNumber");
const progressCircle = document.getElementById("progressCircle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const pagination = document.querySelector(".pagination");
const writingsCount = document.getElementById("writingsCount");

let currentPage = 0;
let isSearchActive = false;

const radius = 20;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;
writingsCount.textContent = writings.length;

function showPage(pageNum) {
  if (isSearchActive) return;

  cards.forEach(card => card.classList.add("hidden"));

  const card = document.querySelector(`[data-page="${pageNum}"]`);
  if (card) card.classList.remove("hidden");

  const progress = (pageNum + 1) / writings.length;
  progressCircle.style.strokeDashoffset = circumference - progress * circumference;

  pageNumber.textContent = pageNum + 1;
  prevBtn.disabled = pageNum === 0;
  nextBtn.disabled = pageNum === writings.length - 1;

  currentPage = pageNum;
}

function performSearch(query) {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    isSearchActive = false;
    searchResults.textContent = "";
    pagination.style.display = "flex";
    showPage(0);
    return;
  }

  isSearchActive = true;
  pagination.style.display = "none";
  cards.forEach(card => card.classList.add("hidden"));

  const matches = writings.filter(writing => {
    const normalizedFields = [
      writing.title,
      writing.subtitle,
      writing.scripture,
      writing.excerpt
    ].map(field => field.toLowerCase());

    const keywordMatch = writing.keywords.some(keyword =>
      keyword.toLowerCase().includes(normalizedQuery)
    );

    return (
      normalizedFields.some(field => field.includes(normalizedQuery)) ||
      keywordMatch
    );
  });

  if (matches.length === 0) {
    searchResults.textContent = "No writings found.";
    return;
  }

  searchResults.textContent = `Found ${matches.length} writing${
    matches.length > 1 ? "s" : ""
  }`;

  matches.forEach(match => {
    const card = document.querySelector(`[data-page="${match.page}"]`);
    if (card) card.classList.remove("hidden");
  });
}

searchInput.addEventListener("input", event => {
  performSearch(event.target.value);
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    showPage(currentPage - 1);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < writings.length - 1) {
    showPage(currentPage + 1);
  }
});

showPage(0);
