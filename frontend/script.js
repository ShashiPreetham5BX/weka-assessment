const API_BASE = 'http://localhost:3000/api';

const select = document.getElementById('employeeSelect');
const resultsArea = document.getElementById('resultsArea');
const btn = document.getElementById('searchBtn');

async function loadEmployees() {
  try {
    const res = await fetch(`${API_BASE}/employees`);

    if (!res.ok) {
      throw new Error('Server error');
    }

    const data = await res.json();

    data.forEach(({ employee }) => {
      const opt = document.createElement('option');
      opt.value = employee;
      opt.textContent = employee;
      select.appendChild(opt);
    });

  } catch (err) {
    resultsArea.innerHTML =
      `<p class="error-state">Could not load employees. Is the server running?</p>`;
  }
}

btn.addEventListener('click', async () => {
  const name = select.value;

  if (!name) {
    resultsArea.innerHTML =
      `<p class="empty-state">Please select an employee first.</p>`;
    return;
  }
  btn.disabled = true;
  resultsArea.innerHTML =
    `<p class="loading-state">Searching network...</p>`;

  try {
    const res = await fetch(
      `${API_BASE}/employees/${encodeURIComponent(name)}/extended-network`
    );

    if (!res.ok) {
      throw new Error('Server error');
    }

    const data = await res.json();

    if (data.length === 0) {
      resultsArea.innerHTML =
        `<p class="empty-state">
          No extended connections with shared skills found for ${name}.
        </p>`;
      return;
    }

    resultsArea.innerHTML = data.map((p) => `
      <div class="person-card">
        <strong>${p.person}</strong>
        <div class="skills">
          Shared skills: ${p.sharedSkills.join(', ')}
        </div>
      </div>
    `).join('');

  } catch (err) {
    resultsArea.innerHTML =
      `<p class="error-state">
        Something went wrong. Please try again later.
      </p>`;

  } finally {
    // Enable button again
    btn.disabled = false;
  }
});
loadEmployees();