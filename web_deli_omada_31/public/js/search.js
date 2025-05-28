
try {
  console.log("✅ search.js is being executed");
} catch (e) {
  console.error(" Error in script:", e);
  alert("Script error: " + e.message);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log(" DOM fully loaded");
  
  const searchInput = document.getElementById("search-box");
  const resultsContainer = document.getElementById("search-results");

  // Debug: Check elements
  if (!searchInput) {
    console.error("❌ Search input element not found!");
    alert("Error: Search input not found!");
    return;
  }
  
  if (!resultsContainer) {
    console.error("❌ Results container not found!");
    alert("Error: Results container not found!");
    return;
  }

  console.log("✅ All required elements found");

  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    console.log(" Input event, query:", query);

    if (query.length < 1) {
      console.log("Query too short, clearing results");
      resultsContainer.innerHTML = "";
      resultsContainer.style.display = "none";
      return;
    }

    console.log("🔍 Making search request...");
    
    try {
      const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
      console.log(" Response received, status:", response.status);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const stores = await response.json();
      console.log(" Stores data:", stores);
      
            if (!stores.length) {
        resultsContainer.innerHTML = "<div class='no-results'>Δεν βρέθηκαν αποτελέσματα</div>";
      } else {
        resultsContainer.innerHTML = stores.map(store => `
        <div class="search-result-item" onclick="location.href='/menu/${store.id}'">
          <img src="${store.imageUrl || '/images/default-store.png'}" 
              alt="${store.name}" 
              onerror="this.onerror=null;this.src='/images/default shop.jpg';">
          <span>${store.name}</span>
        </div>
      `).join("");}
      
      resultsContainer.style.display = "block";
      console.log("✅ Results displayed");
      
    } catch (error) {
      console.error("❌ Search failed:", error);
      resultsContainer.innerHTML = "<div class='error'>Σφάλμα στην αναζήτηση</div>";
      resultsContainer.style.display = "block";
    }
  });

  // Debug: Log clicks
  document.addEventListener("click", (e) => {
    console.log(" Document clicked, target:", e.target);
    if (!e.target.closest(".food-section")) {
      resultsContainer.style.display = "none";
    }
  });
});

// Debug: Check if script execution completes
console.log("✅ search.js execution completed");