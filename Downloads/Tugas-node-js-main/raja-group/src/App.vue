<template>
  <div class="app-shell">
    <!-- LOGIN PAGE -->
    <section v-if="!isLoggedIn" class="login-page">
      <div class="login-hero">
        <div class="brand-row">
          <img class="logo-image" src="/rivaflow-logo.png" alt="RivaFlow logo" />
          <h1>Riva<span>Flow</span></h1>
        </div>

        <div class="hero-copy">
          <p class="eyebrow">Semantic Management System</p>
          <h2>Manage.<br /><span>Connect.</span><br />Understand.</h2>
          <p class="hero-desc">
            RivaFlow membantu tim mengelola project, task, client, laporan,
            jadwal, dan alur kerja bisnis dalam satu dashboard manajemen berbasis
            konsep web semantik.
          </p>
        </div>

        <div class="hero-features">
          <div class="feature-card">
            <div class="feature-icon"><Network :size="22" /></div>
            <div>
              <h3>Semantic Relation</h3>
              <p>Hubungkan project, task, client, dan anggota tim.</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon"><Search :size="22" /></div>
            <div>
              <h3>Smart Search</h3>
              <p>Cari data berdasarkan nama, status, client, dan prioritas.</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon"><Database :size="22" /></div>
            <div>
              <h3>Local Data Storage</h3>
              <p>Data tersimpan di browser memakai localStorage.</p>
            </div>
          </div>
        </div>
      </div>

      <form v-if="authMode === 'login'" class="login-card" @submit.prevent="login">
        <img class="card-logo-image" src="/rivaflow-logo.png" alt="RivaFlow logo" />
        <h2>Riva<span>Flow</span></h2>
        <p>Sign in to your management dashboard</p>

        <div v-if="loginError" class="alert error-alert">
          {{ loginError }}
        </div>

        <label>Email</label>
        <div class="input-group">
          <Mail :size="18" />
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="admin@rivagroup.id"
            required
          />
        </div>

        <label>Password</label>
        <div class="input-group">
          <Lock :size="18" />
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="admin123"
            required
          />
        </div>

        <div class="login-options">
          <label class="remember">
            <input v-model="loginForm.remember" type="checkbox" />
            Remember me
          </label>
          <a href="#" @click.prevent="fillDemoAccount">Use admin account</a>
        </div>

        <button class="primary-btn" type="submit">Sign In</button>
        <p class="demo-info">
          Akun admin: <strong>admin@rivagroup.id</strong> / <strong>admin123</strong>
        </p>

        <p class="auth-switch">
          Belum punya akun?
          <a href="#" @click.prevent="switchAuthMode('register')">Buat account baru</a>
        </p>
      </form>

      <form v-else class="login-card" @submit.prevent="registerUser">
        <img class="card-logo-image" src="/rivaflow-logo.png" alt="RivaFlow logo" />
        <h2>Create <span>Account</span></h2>
        <p>Daftar sebagai user RivaFlow</p>

        <div v-if="registerError" class="alert error-alert">
          {{ registerError }}
        </div>

        <div v-if="registerSuccess" class="alert success-alert">
          {{ registerSuccess }}
        </div>

        <label>Username</label>
        <div class="input-group">
          <UserRound :size="18" />
          <input
            v-model="registerForm.username"
            type="text"
            placeholder="Nama yang tampil di dashboard"
            required
          />
        </div>

        <label>Full Name</label>
        <div class="input-group">
          <UserRound :size="18" />
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <label>Email</label>
        <div class="input-group">
          <Mail :size="18" />
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="contoh@email.com"
            required
          />
        </div>

        <label>Password</label>
        <div class="input-group">
          <Lock :size="18" />
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="Minimal 6 karakter"
            required
          />
        </div>

        <label>Confirm Password</label>
        <div class="input-group">
          <Lock :size="18" />
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Ulangi password"
            required
          />
        </div>

        <button class="primary-btn register-submit-btn" type="submit">Create Account</button>

        <p class="auth-switch">
          Sudah punya akun?
          <a href="#" @click.prevent="switchAuthMode('login')">Sign in</a>
        </p>
      </form>
    </section>

    <!-- DASHBOARD APP -->
    <section v-else class="dashboard-page">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <img class="logo-image" src="/rivaflow-logo.png" alt="RivaFlow logo" />
          <h1>Riva<span>Flow</span></h1>
        </div>

        <nav class="menu-list">
          <button
            v-for="item in menuItems"
            :key="item.name"
            :class="['menu-item', { active: activeMenu === item.name }]"
            @click="activeMenu = item.name"
          >
            <component :is="item.icon" :size="18" />
            {{ item.name }}
            <small v-if="item.badge">{{ item.badge }}</small>
          </button>
        </nav>

        <div class="upgrade-card">
          <div class="upgrade-icon"><BrainCircuit :size="22" /></div>
          <h3>Semantic Mode</h3>
          <p>Data saling terhubung melalui relasi project, task, client, dan team.</p>
          <button @click="activeMenu = 'Ontology'">View Ontology</button>
        </div>

        <div class="user-box">
          <div class="avatar"><UserRound :size="20" /></div>
          <div>
            <h4>{{ currentUser?.name || 'User' }}</h4>
            <p>{{ currentUser?.role || 'RIVA User' }}</p>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <div>
            <p class="eyebrow">{{ activeMenu }}</p>
            <h2>{{ pageTitle }}</h2>
          </div>

          <div class="topbar-actions">
            <input v-model="globalSearch" type="text" placeholder="Search anything..." />
            <button title="Notifications"><Bell :size="18" /></button>
            <button @click="resetSampleData" title="Reset data to zero"><RefreshCcw :size="18" /></button>
            <button @click="logout">Logout</button>
          </div>
        </header>

        <!-- DASHBOARD -->
        <section v-if="activeMenu === 'Dashboard'" class="dashboard-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-card">
            <div class="stat-icon"><component :is="stat.icon" :size="22" /></div>
            <div>
              <p>{{ stat.label }}</p>
              <h3>{{ stat.value }}</h3>
              <span>{{ stat.growth }}</span>
            </div>
          </div>

          <div class="panel chart-panel">
            <div class="panel-header">
              <h3>Performance Overview</h3>
              <select v-model="selectedProjectStatus">
                <option value="All">All Status</option>
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>

            <div class="line-chart-card">
              <div class="chart-topline">
                <span>Project Progress</span>
                <strong>{{ averageProgress }}%</strong>
              </div>

              <div class="line-chart-wrap">
                <svg viewBox="0 0 600 260" preserveAspectRatio="none" class="line-chart-svg">
                  <defs>
                    <linearGradient id="orangeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#ff6a00" stop-opacity="0.36" />
                      <stop offset="100%" stop-color="#ff6a00" stop-opacity="0" />
                    </linearGradient>
                  </defs>

                  <g class="chart-grid-lines">
                    <line x1="0" y1="52" x2="600" y2="52" />
                    <line x1="0" y1="104" x2="600" y2="104" />
                    <line x1="0" y1="156" x2="600" y2="156" />
                    <line x1="0" y1="208" x2="600" y2="208" />
                  </g>

                  <path :d="chartAreaPath" class="chart-area" />
                  <path :d="chartLinePath" class="chart-line" />

                  <g v-for="point in chartPoints" :key="point.label">
                    <circle :cx="point.x" :cy="point.y" r="5" class="chart-dot" />
                  </g>
                </svg>

                <div v-if="filteredProjectsByStatus.length === 0" class="empty-chart-text">
                  Belum ada data project.
                </div>
              </div>
            </div>

            <div class="summary-row">
              <div>
                <p>Completed Profit</p>
                <strong>{{ formatCurrency(totalProfit) }}</strong>
              </div>
              <div>
                <p>Open Tasks</p>
                <strong>{{ openTasks.length }}</strong>
              </div>
              <div>
                <p>Avg Progress</p>
                <strong>{{ averageProgress }}%</strong>
              </div>
            </div>
          </div>

          <div class="panel task-panel">
            <div class="panel-header">
              <h3>Urgent Tasks</h3>
              <a href="#" @click.prevent="activeMenu = 'Tasks'">View All</a>
            </div>

            <div v-for="task in urgentTasks" :key="task.id" class="task-row">
              <input
                type="checkbox"
                :checked="task.status === 'Done'"
                @change="toggleTaskStatus(task.id)"
              />
              <div>
                <h4>{{ task.title }}</h4>
                <p>{{ getProjectName(task.projectId) }}</p>
              </div>
              <span :class="['priority', task.priority.toLowerCase()]">{{ task.priority }}</span>
            </div>

            <p v-if="urgentTasks.length === 0" class="empty-text">Tidak ada task urgent.</p>
          </div>

          <div class="panel projects-panel">
            <div class="panel-header">
              <h3>Projects Overview</h3>
              <a href="#" @click.prevent="activeMenu = 'Projects'">View All</a>
            </div>

            <div v-for="project in projects.slice(0, 5)" :key="project.id" class="project-row">
              <div class="project-initial">{{ project.name.charAt(0) }}</div>
              <div class="project-info">
                <h4>{{ project.name }}</h4>
                <p>{{ getClientName(project.clientId) }} • {{ project.status }}</p>
                <div class="progress-track">
                  <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
                </div>
              </div>
              <strong>{{ project.progress }}%</strong>
            </div>

            <p v-if="projects.length === 0" class="empty-text">
              Belum ada project. Tambahkan client terlebih dahulu, lalu buat project baru.
            </p>
          </div>

          <div class="panel activity-panel">
            <div class="panel-header">
              <h3>Recent Activity</h3>
              <a href="#" @click.prevent="activeMenu = 'Activity'">View All</a>
            </div>

            <div v-for="activity in activities.slice(0, 5)" :key="activity.id" class="activity-row">
              <div class="dot"></div>
              <p>{{ activity.text }}</p>
            </div>
          </div>
        </section>

        <!-- PROJECTS -->
        <section v-else-if="activeMenu === 'Projects'" class="content-grid">
          <div class="panel form-panel">
            <div class="panel-header">
              <h3>{{ editingProjectId ? 'Edit Project' : 'Add Project' }}</h3>
              <button v-if="editingProjectId" class="ghost-btn" @click="cancelProjectEdit">Cancel</button>
            </div>

            <form class="data-form" @submit.prevent="saveProject">
              <label>Project Name</label>
              <input v-model="projectForm.name" type="text" required />

              <label>Client</label>
              <select v-model="projectForm.clientId" required>
                <option disabled value="">Select client</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>

              <label>Status</label>
              <select v-model="projectForm.status" required>
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>

              <label>Progress: {{ projectForm.progress }}%</label>
              <input v-model.number="projectForm.progress" type="range" min="0" max="100" />

              <label>Deadline</label>
              <input v-model="projectForm.deadline" type="date" required />

              <label>Budget</label>
              <input v-model.number="projectForm.budget" type="number" min="0" required />

              <label>Description</label>
              <textarea v-model="projectForm.description" rows="4" required></textarea>

              <button class="primary-btn" type="submit">
                {{ editingProjectId ? 'Update Project' : 'Save Project' }}
              </button>
            </form>
          </div>

          <div class="panel table-panel wide-panel">
            <div class="panel-header">
              <h3>Project List</h3>
              <span>{{ filteredProjects.length }} data</span>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Deadline</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="project in filteredProjects" :key="project.id">
                    <td>
                      <strong>{{ project.name }}</strong>
                      <small>{{ project.description }}</small>
                    </td>
                    <td>{{ getClientName(project.clientId) }}</td>
                    <td><span class="status-pill">{{ project.status }}</span></td>
                    <td>
                      <div class="mini-progress">
                        <div :style="{ width: project.progress + '%' }"></div>
                      </div>
                      {{ project.progress }}%
                    </td>
                    <td>{{ formatDate(project.deadline) }}</td>
                    <td class="action-cell">
                      <button @click="viewProjectDetail(project.id)">Detail</button>
                      <button @click="editProject(project)">Edit</button>
                      <button class="danger-btn" @click="deleteProject(project.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- TASKS -->
        <section v-else-if="activeMenu === 'Tasks'" class="content-grid">
          <div class="panel form-panel">
            <div class="panel-header">
              <h3>{{ editingTaskId ? 'Edit Task' : 'Add Task' }}</h3>
              <button v-if="editingTaskId" class="ghost-btn" @click="cancelTaskEdit">Cancel</button>
            </div>

            <form class="data-form" @submit.prevent="saveTask">
              <label>Task Title</label>
              <input v-model="taskForm.title" type="text" required />

              <label>Project</label>
              <select v-model="taskForm.projectId" required>
                <option disabled value="">Select project</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>

              <label>Assigned To</label>
              <select v-model="taskForm.assignedTo" required>
                <option disabled value="">Select team member</option>
                <option v-for="member in teamMembers" :key="member.id" :value="member.id">
                  {{ member.name }}
                </option>
              </select>

              <label>Priority</label>
              <select v-model="taskForm.priority" required>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <label>Status</label>
              <select v-model="taskForm.status" required>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Review</option>
                <option>Done</option>
              </select>

              <label>Deadline</label>
              <input v-model="taskForm.deadline" type="date" required />

              <button class="primary-btn" type="submit">
                {{ editingTaskId ? 'Update Task' : 'Save Task' }}
              </button>
            </form>
          </div>

          <div class="panel table-panel wide-panel">
            <div class="panel-header">
              <h3>Task List</h3>
              <select v-model="taskFilter">
                <option value="All">All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div class="kanban-board">
              <div v-for="status in taskStatuses" :key="status" class="kanban-column">
                <h4>{{ status }}</h4>
                <div
                  v-for="task in filteredTasksByStatus(status)"
                  :key="task.id"
                  class="kanban-card"
                >
                  <div class="kanban-title">
                    <strong>{{ task.title }}</strong>
                    <span :class="['priority', task.priority.toLowerCase()]">{{ task.priority }}</span>
                  </div>
                  <p>{{ getProjectName(task.projectId) }}</p>
                  <small>Assigned: {{ getMemberName(task.assignedTo) }}</small>
                  <small>Deadline: {{ formatDate(task.deadline) }}</small>
                  <div class="card-actions">
                    <button @click="editTask(task)">Edit</button>
                    <button class="danger-btn" @click="deleteTask(task.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- TEAMS -->
        <section v-else-if="activeMenu === 'Teams'" class="content-grid cards-only">
          <div class="panel section-panel">
            <div class="panel-header">
              <h3>Team Members</h3>
              <span>{{ filteredMembers.length }} members</span>
            </div>

            <div class="cards-grid">
              <div v-for="member in filteredMembers" :key="member.id" class="data-card">
                <div class="member-avatar">{{ getInitials(member.name) }}</div>
                <h4>{{ member.name }}</h4>
                <p>{{ member.role }}</p>
                <span>{{ member.email }}</span>
                <div class="skill-list">
                  <small v-for="skill in member.skills" :key="skill">{{ skill }}</small>
                </div>
                <div class="semantic-box">
                  <strong>Works On</strong>
                  <p>{{ getMemberProjects(member.id).join(', ') || 'No project assigned' }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CLIENTS -->
        <section v-else-if="activeMenu === 'Clients'" class="content-grid cards-only">
          <div class="panel form-panel">
            <div class="panel-header">
              <h3>Add Client</h3>
            </div>

            <form class="data-form" @submit.prevent="saveClient">
              <div v-if="clientError" class="alert error-alert">
                {{ clientError }}
              </div>

              <label>Client Name</label>
              <input v-model="clientForm.name" type="text" required />

              <label>Industry</label>
              <input v-model="clientForm.industry" type="text" required />

              <label>Email</label>
              <input v-model="clientForm.email" type="email" required />

              <label>Phone</label>
              <input
                v-model="clientForm.phone"
                type="text"
                placeholder="Contoh: 081234567890"
                required
              />
              <small class="form-hint">
                Nomor HP harus dimulai dari 08 dan berisi 10-13 digit angka.
              </small>

              <button class="primary-btn" type="submit">Save Client</button>
            </form>
          </div>

          <div class="panel section-panel wide-panel">
            <div class="panel-header">
              <h3>Client Directory</h3>
              <span>{{ filteredClients.length }} clients</span>
            </div>

            <div class="cards-grid two-col">
              <div v-for="client in filteredClients" :key="client.id" class="data-card client-card">
                <h4>{{ client.name }}</h4>
                <p>{{ client.industry }}</p>
                <span>{{ client.email }}</span>
                <span>{{ client.phone }}</span>
                <div class="semantic-box">
                  <strong>Related Projects</strong>
                  <p>{{ getClientProjects(client.id).join(', ') || 'No related project' }}</p>
                </div>
                <button class="danger-btn" @click="deleteClient(client.id)">Delete Client</button>
              </div>
            </div>
          </div>
        </section>

        <!-- REPORTS -->
        <section v-else-if="activeMenu === 'Reports'" class="content-grid cards-only">
          <div class="panel section-panel">
            <div class="panel-header">
              <h3>Management Reports</h3>
              <button class="ghost-btn" @click="downloadReport">Download Text Report</button>
            </div>

            <div class="report-grid">
              <div class="report-card">
                <p>Completed Projects</p>
                <strong>{{ completedProjects.length }}</strong>
              </div>
              <div class="report-card">
                <p>Completed Profit</p>
                <strong>{{ formatShortCurrency(totalProfit) }}</strong>
              </div>
              <div class="report-card">
                <p>Projects In Progress</p>
                <strong>{{ inProgressProjects.length }}</strong>
              </div>
              <div class="report-card">
                <p>Completed Tasks</p>
                <strong>{{ completedTasks.length }}</strong>
              </div>
              <div class="report-card">
                <p>High Priority Tasks</p>
                <strong>{{ highPriorityTasks.length }}</strong>
              </div>
            </div>

            <div class="semantic-report">
              <h4>Semantic Summary</h4>
              <p>
                Sistem memiliki {{ projects.length }} project, {{ completedProjects.length }} project selesai,
                {{ clients.length }} client, {{ tasks.length }} task, dan {{ teamMembers.length }} anggota tim.
                Profit hanya bertambah ketika status project diubah menjadi Completed.
              </p>
            </div>
          </div>
        </section>

        <!-- CALENDAR -->
        <section v-else-if="activeMenu === 'Calendar'" class="content-grid cards-only">
          <div class="panel section-panel">
            <div class="panel-header">
              <h3>Schedule & Deadlines</h3>
              <span>{{ calendarItems.length }} items</span>
            </div>

            <div class="timeline">
              <div v-for="item in calendarItems" :key="item.id" class="timeline-item">
                <div class="timeline-date">
                  <strong>{{ getDateDay(item.date) }}</strong>
                  <small>{{ getDateMonth(item.date) }}</small>
                </div>
                <div>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.type }} • {{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- MESSAGES -->
        <section v-else-if="activeMenu === 'Messages'" class="content-grid cards-only">
          <div class="panel section-panel">
            <div class="panel-header">
              <h3>Internal Messages</h3>
              <span>{{ messages.length }} messages</span>
            </div>

            <div class="message-list">
              <div v-for="message in messages" :key="message.id" class="message-card">
                <div class="member-avatar small">{{ getInitials(message.sender) }}</div>
                <div>
                  <h4>{{ message.sender }}</h4>
                  <p>{{ message.text }}</p>
                  <small>{{ message.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ONTOLOGY -->
        <section v-else-if="activeMenu === 'Ontology'" class="content-grid cards-only">
          <div class="panel section-panel">
            <div class="panel-header">
              <h3>Web Semantic Ontology</h3>
              <span>RivaFlow Knowledge Model</span>
            </div>

            <div class="ontology-grid">
              <div class="ontology-card">
                <h4>Classes</h4>
                <p>Project, Task, Client, TeamMember, Report, Schedule, Message</p>
              </div>
              <div class="ontology-card">
                <h4>Object Properties</h4>
                <p>hasClient, hasTask, assignedTo, worksOn, hasDeadline, discussedIn</p>
              </div>
              <div class="ontology-card">
                <h4>Data Properties</h4>
                <p>name, status, progress, priority, deadline, budget, email</p>
              </div>
            </div>

            <div class="rdf-box">
              <h4>Generated RDF-like Triples</h4>
              <pre>{{ rdfTriples }}</pre>
            </div>
          </div>
        </section>

        <!-- SETTINGS -->
        <section v-else-if="activeMenu === 'Settings'" class="content-grid cards-only">
          <div class="panel section-panel">
            <div class="panel-header">
              <h3>Application Settings</h3>
            </div>

            <div class="settings-grid">
              <div class="setting-card">
                <h4>Local Storage</h4>
                <p>Semua data project, task, dan client tersimpan di browser.</p>
                <button class="danger-btn" @click="clearAllData">Clear All Data</button>
              </div>
              <div class="setting-card">
                <h4>Application Identity</h4>
                <p>Nama aplikasi dan tema tetap memakai RivaFlow dengan warna hitam-oranye.</p>
              </div>
              <div class="setting-card">
                <h4>Academic Purpose</h4>
                <p>Aplikasi ini dibuat untuk implementasi tugas akhir mata kuliah Web Semantik.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ACTIVITY -->
        <section v-else-if="activeMenu === 'Activity'" class="content-grid cards-only">
          <div class="panel section-panel">
            <div class="panel-header">
              <h3>Activity Log</h3>
              <span>{{ activities.length }} activities</span>
            </div>

            <div class="activity-list-full">
              <div v-for="activity in activities" :key="activity.id" class="activity-row full">
                <div class="dot"></div>
                <div>
                  <p>{{ activity.text }}</p>
                  <small>{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Briefcase,
  BarChart3,
  CalendarDays,
  MessageSquare,
  Settings,
  Mail,
  Lock,
  Bell,
  UserRound,
  TrendingUp,
  DollarSign,
  Network,
  Database,
  Search,
  BrainCircuit,
  RefreshCcw,
} from "lucide-vue-next";

const STORAGE_KEY = "riva-group-semantic-app";
const USERS_STORAGE_KEY = "riva-group-users";

const isLoggedIn = ref(false);
const activeMenu = ref("Dashboard");
const authMode = ref("login");
const currentUser = ref(null);
const globalSearch = ref("");
const loginError = ref("");
const selectedProjectStatus = ref("All");
const taskFilter = ref("All");

const loginForm = ref({
  email: "",
  password: "",
  remember: true,
});

const registerForm = ref({
  username: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const registerError = ref("");
const registerSuccess = ref("");
const users = ref([]);

const clients = ref([]);
const projects = ref([]);
const tasks = ref([]);
const teamMembers = ref([]);
const activities = ref([]);
const messages = ref([]);

const editingProjectId = ref(null);
const editingTaskId = ref(null);

const projectForm = ref({
  name: "",
  clientId: "",
  status: "Planning",
  progress: 0,
  deadline: "",
  budget: 0,
  description: "",
});

const taskForm = ref({
  title: "",
  projectId: "",
  assignedTo: "",
  priority: "Medium",
  status: "To Do",
  deadline: "",
});

const clientForm = ref({
  name: "",
  industry: "",
  email: "",
  phone: "",
});

const clientError = ref("");

const menuItems = computed(() => [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Projects", icon: FolderKanban },
  { name: "Tasks", icon: CheckSquare },
  { name: "Teams", icon: Users },
  { name: "Clients", icon: Briefcase },
  { name: "Reports", icon: BarChart3 },
  { name: "Calendar", icon: CalendarDays },
  { name: "Messages", icon: MessageSquare, badge: messages.value.length },
  { name: "Ontology", icon: Network },
  { name: "Settings", icon: Settings },
]);

const taskStatuses = ["To Do", "In Progress", "Review", "Done"];

const pageTitle = computed(() => {
  const titles = {
    Dashboard: `Welcome back, ${currentUser.value?.username || currentUser.value?.name || "Admin"}`,
    Projects: "Manage Projects",
    Tasks: "Manage Tasks",
    Teams: "Team Directory",
    Clients: "Client Management",
    Reports: "Reports & Insight",
    Calendar: "Calendar & Deadlines",
    Messages: "Team Messages",
    Ontology: "Semantic Data Model",
    Settings: "Settings",
    Activity: "Activity Log",
  };
  return titles[activeMenu.value] || activeMenu.value;
});

const sampleData = {
  // Data utama sengaja dikosongkan supaya dashboard dimulai dari 0.
  // Tambahkan client, project, dan task melalui aplikasi.
  clients: [],
  projects: [],
  tasks: [],
  teamMembers: [
    {
      id: "member-001",
      name: "Fathur Riva",
      role: "Project Manager",
      email: "fathur@rivaflow.id",
      skills: ["Management", "Semantic Web", "Frontend"],
    },
    {
      id: "member-002",
      name: "Raden Bagus",
      role: "UI/UX Designer",
      email: "raden@rivaflow.id",
      skills: ["Design", "Research", "Prototype"],
    },
    {
      id: "member-003",
      name: "Raja Halomoan",
      role: "Data Analyst",
      email: "raja@rivaflow.id",
      skills: ["Report", "Analytics", "Data Model"],
    },
    {
      id: "member-004",
      name: "Fadhlan Rifa'i",
      role: "Frontend Developer",
      email: "fadhlan@rivaflow.id",
      skills: ["Vue", "API", "Dashboard"],
    },
  ],
  activities: [
    { id: "act-001", text: "Fathur updated Riva Website Redesign progress", time: "Today, 09:20" },
    { id: "act-002", text: "Raden completed UI review for dashboard", time: "Today, 10:15" },
    { id: "act-003", text: "Raja uploaded campaign performance report", time: "Yesterday, 16:40" },
    { id: "act-004", text: "Fadhlan created authentication task", time: "Yesterday, 13:05" },
    { id: "act-005", text: "Project Phoenix meeting scheduled", time: "Monday, 11:30" },
  ],
  messages: [
    { id: "msg-001", sender: "Raden Bagus", text: "Dashboard design sudah saya update. Mohon dicek bagian project detail.", time: "09:30" },
    { id: "msg-002", sender: "Raja Halomoan", text: "Report Q2 sudah siap dan bisa dimasukkan ke menu Reports.", time: "10:12" },
    { id: "msg-003", sender: "Fadhlan Rifa'i", text: "Saya lanjutkan task authentication flow untuk client portal.", time: "11:45" },
  ],
};

const saveToStorage = () => {
  const data = {
    clients: clients.value,
    projects: projects.value,
    tasks: tasks.value,
    teamMembers: teamMembers.value,
    activities: activities.value,
    messages: messages.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadUsers = () => {
  const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (savedUsers) {
    users.value = JSON.parse(savedUsers);
    return;
  }

  users.value = [
    {
      id: "user-admin",
      username: "Fathur",
      name: "Fathur Riva",
      email: "admin@rivagroup.id",
      password: "admin123",
      role: "Admin Manager",
      createdAt: new Date().toISOString(),
    },
  ];
  saveUsers();
};

const saveUsers = () => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users.value));
};

const loadFromStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    const parsed = JSON.parse(saved);
    clients.value = parsed.clients || [];
    projects.value = parsed.projects || [];
    tasks.value = parsed.tasks || [];
    teamMembers.value = parsed.teamMembers || [];
    activities.value = parsed.activities || [];
    messages.value = parsed.messages || [];
    return;
  }

  resetSampleData();
};

const resetSampleData = () => {
  clients.value = structuredClone(sampleData.clients);
  projects.value = structuredClone(sampleData.projects);
  tasks.value = structuredClone(sampleData.tasks);
  teamMembers.value = structuredClone(sampleData.teamMembers);
  activities.value = structuredClone(sampleData.activities);
  messages.value = structuredClone(sampleData.messages);
  saveToStorage();
};

const clearAllData = () => {
  if (confirm("Yakin ingin menghapus semua data dan mengembalikan sample data?")) {
    localStorage.removeItem(STORAGE_KEY);
    resetSampleData();
  }
};

watch([clients, projects, tasks, teamMembers, activities, messages], saveToStorage, { deep: true });

onMounted(() => {
  loadUsers();
  loadFromStorage();
});

const login = () => {
  loginError.value = "";

  const email = loginForm.value.email.trim().toLowerCase();
  const password = loginForm.value.password;

  const foundUser = users.value.find(
    (user) => user.email.toLowerCase() === email && user.password === password
  );

  if (!foundUser) {
    loginError.value = "Email atau password salah. Silakan cek kembali akun kamu.";
    return;
  }

  currentUser.value = foundUser;
  isLoggedIn.value = true;
  addActivity(`${foundUser.name} logged in to RivaFlow dashboard`);
};

const registerUser = () => {
  registerError.value = "";
  registerSuccess.value = "";

  const username = registerForm.value.username.trim();
  const name = registerForm.value.name.trim();
  const email = registerForm.value.email.trim().toLowerCase();
  const password = registerForm.value.password;
  const confirmPassword = registerForm.value.confirmPassword;

  if (username.length < 3) {
    registerError.value = "Username minimal 3 karakter.";
    return;
  }

  if (name.length < 3) {
    registerError.value = "Nama lengkap minimal 3 karakter.";
    return;
  }

  if (password.length < 6) {
    registerError.value = "Password minimal 6 karakter.";
    return;
  }

  if (password !== confirmPassword) {
    registerError.value = "Konfirmasi password tidak sama.";
    return;
  }

  const usernameAlreadyUsed = users.value.some(
    (user) => (user.username || "").toLowerCase() === username.toLowerCase()
  );
  if (usernameAlreadyUsed) {
    registerError.value = "Username ini sudah dipakai. Gunakan username lain.";
    return;
  }

  const emailAlreadyUsed = users.value.some((user) => user.email.toLowerCase() === email);
  if (emailAlreadyUsed) {
    registerError.value = "Email ini sudah terdaftar. Gunakan email lain atau langsung sign in.";
    return;
  }

  const newUser = {
    id: createId("user"),
    username,
    name,
    email,
    password,
    role: "User",
    createdAt: new Date().toISOString(),
  };

  users.value.push(newUser);
  saveUsers();

  registerSuccess.value = "Account berhasil dibuat. Silakan sign in.";
  loginForm.value.email = email;
  loginForm.value.password = "";
  registerForm.value = {
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  setTimeout(() => {
    authMode.value = "login";
    registerSuccess.value = "";
  }, 900);
};

const switchAuthMode = (mode) => {
  authMode.value = mode;
  loginError.value = "";
  registerError.value = "";
  registerSuccess.value = "";
};

const fillDemoAccount = () => {
  loginForm.value.email = "admin@rivagroup.id";
  loginForm.value.password = "admin123";
};

const logout = () => {
  addActivity(`${currentUser.value?.name || "User"} logged out from dashboard`);
  currentUser.value = null;
  isLoggedIn.value = false;
  activeMenu.value = "Dashboard";
};

const query = computed(() => globalSearch.value.toLowerCase().trim());

const stats = computed(() => [
  {
    label: "Total Projects",
    value: projects.value.length,
    growth: `${completedProjects.value.length} completed projects`,
    icon: FolderKanban,
  },
  {
    label: "Open Tasks",
    value: openTasks.value.length,
    growth: `${completedTasks.value.length} completed tasks`,
    icon: CheckSquare,
  },
  {
    label: "Clients",
    value: clients.value.length,
    growth: `${inProgressProjects.value.length} active projects`,
    icon: Users,
  },
  {
    label: "Profit",
    value: formatShortCurrency(totalProfit.value),
    growth: "From completed projects only",
    icon: DollarSign,
  },
]);

const filteredProjects = computed(() => {
  return projects.value.filter((project) => {
    const clientName = getClientName(project.clientId).toLowerCase();
    const text = `${project.name} ${clientName} ${project.status} ${project.description}`.toLowerCase();
    return text.includes(query.value);
  });
});

const filteredProjectsByStatus = computed(() => {
  if (selectedProjectStatus.value === "All") return projects.value;
  return projects.value.filter((project) => project.status === selectedProjectStatus.value);
});

const filteredClients = computed(() => {
  return clients.value.filter((client) => {
    const text = `${client.name} ${client.industry} ${client.email} ${client.phone}`.toLowerCase();
    return text.includes(query.value);
  });
});

const filteredMembers = computed(() => {
  return teamMembers.value.filter((member) => {
    const text = `${member.name} ${member.role} ${member.email} ${member.skills.join(" ")}`.toLowerCase();
    return text.includes(query.value);
  });
});

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const projectName = getProjectName(task.projectId).toLowerCase();
    const memberName = getMemberName(task.assignedTo).toLowerCase();
    const text = `${task.title} ${projectName} ${memberName} ${task.priority} ${task.status}`.toLowerCase();
    const priorityMatch = taskFilter.value === "All" || task.priority === taskFilter.value;
    return text.includes(query.value) && priorityMatch;
  });
});

const openTasks = computed(() => tasks.value.filter((task) => task.status !== "Done"));
const completedTasks = computed(() => tasks.value.filter((task) => task.status === "Done"));
const highPriorityTasks = computed(() => tasks.value.filter((task) => task.priority === "High"));
const urgentTasks = computed(() => tasks.value.filter((task) => task.priority === "High" && task.status !== "Done"));
const completedProjects = computed(() => projects.value.filter((project) => project.status === "Completed"));
const inProgressProjects = computed(() => projects.value.filter((project) => project.status === "In Progress"));
const totalRevenue = computed(() => projects.value.reduce((sum, project) => sum + Number(project.budget || 0), 0));
const totalProfit = computed(() =>
  completedProjects.value.reduce((sum, project) => sum + Number(project.budget || 0), 0)
);
const averageProgress = computed(() => {
  if (!projects.value.length) return 0;
  const total = projects.value.reduce((sum, project) => sum + Number(project.progress || 0), 0);
  return Math.round(total / projects.value.length);
});

const chartPoints = computed(() => {
  const source = filteredProjectsByStatus.value;
  const width = 600;
  const height = 230;
  const topPadding = 18;
  const bottomPadding = 20;

  if (!source.length) return [];

  if (source.length === 1) {
    const progress = Number(source[0].progress || 0);
    return [
      {
        x: width / 2,
        y: topPadding + (100 - progress) * ((height - topPadding - bottomPadding) / 100),
        label: source[0].id,
      },
    ];
  }

  return source.map((project, index) => {
    const progress = Number(project.progress || 0);
    const x = (index / (source.length - 1)) * width;
    const y = topPadding + (100 - progress) * ((height - topPadding - bottomPadding) / 100);

    return {
      x,
      y,
      label: project.id,
    };
  });
});

const chartLinePath = computed(() => {
  if (!chartPoints.value.length) return "";

  if (chartPoints.value.length === 1) {
    const point = chartPoints.value[0];
    return `M 0 ${point.y} L 600 ${point.y}`;
  }

  return chartPoints.value
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
});

const chartAreaPath = computed(() => {
  if (!chartPoints.value.length) return "";

  if (chartPoints.value.length === 1) {
    const point = chartPoints.value[0];
    return `M 0 ${point.y} L 600 ${point.y} L 600 260 L 0 260 Z`;
  }

  const line = chartPoints.value
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return `${line} L 600 260 L 0 260 Z`;
});

const calendarItems = computed(() => {
  const projectDeadlines = projects.value.map((project) => ({
    id: `cal-${project.id}`,
    title: project.name,
    date: project.deadline,
    type: "Project Deadline",
    description: `${project.status} • ${project.progress}% progress`,
  }));

  const taskDeadlines = tasks.value.map((task) => ({
    id: `cal-${task.id}`,
    title: task.title,
    date: task.deadline,
    type: "Task Deadline",
    description: `${getProjectName(task.projectId)} • ${task.priority} priority`,
  }));

  return [...projectDeadlines, ...taskDeadlines].sort((a, b) => new Date(a.date) - new Date(b.date));
});

const rdfTriples = computed(() => {
  const triples = [];

  projects.value.forEach((project) => {
    const projectKey = toRdfKey(project.name);
    const clientKey = toRdfKey(getClientName(project.clientId));

    triples.push(`:${projectKey} rdf:type :Project .`);
    triples.push(`:${projectKey} :hasClient :${clientKey} .`);
    triples.push(`:${projectKey} :hasStatus "${project.status}" .`);
    triples.push(`:${projectKey} :hasProgress "${project.progress}%" .`);

    tasks.value
      .filter((task) => task.projectId === project.id)
      .forEach((task) => {
        const taskKey = toRdfKey(task.title);
        const memberKey = toRdfKey(getMemberName(task.assignedTo));
        triples.push(`:${projectKey} :hasTask :${taskKey} .`);
        triples.push(`:${taskKey} rdf:type :Task .`);
        triples.push(`:${taskKey} :assignedTo :${memberKey} .`);
        triples.push(`:${taskKey} :hasPriority "${task.priority}" .`);
      });
  });

  return triples.join("\n");
});

const saveProject = () => {
  if (editingProjectId.value) {
    const index = projects.value.findIndex((project) => project.id === editingProjectId.value);
    if (index !== -1) {
      projects.value[index] = { ...projectForm.value, id: editingProjectId.value };
      addActivity(`Project updated: ${projectForm.value.name}`);
    }
  } else {
    const newProject = {
      ...projectForm.value,
      id: createId("project"),
    };
    projects.value.unshift(newProject);
    addActivity(`New project created: ${newProject.name}`);
  }

  resetProjectForm();
};

const editProject = (project) => {
  editingProjectId.value = project.id;
  projectForm.value = { ...project };
};

const cancelProjectEdit = () => {
  resetProjectForm();
};

const deleteProject = (projectId) => {
  const relatedTasks = tasks.value.filter((task) => task.projectId === projectId);

  if (relatedTasks.length > 0) {
    alert("Project ini masih memiliki task. Hapus task terkait terlebih dahulu.");
    return;
  }

  if (confirm("Yakin ingin menghapus project ini?")) {
    const projectName = getProjectName(projectId);
    projects.value = projects.value.filter((project) => project.id !== projectId);
    addActivity(`Project deleted: ${projectName}`);
  }
};

const viewProjectDetail = (projectId) => {
  const project = projects.value.find((item) => item.id === projectId);
  if (!project) return;

  const relatedTasks = tasks.value.filter((task) => task.projectId === projectId);
  const detail = [
    `Project: ${project.name}`,
    `Client: ${getClientName(project.clientId)}`,
    `Status: ${project.status}`,
    `Progress: ${project.progress}%`,
    `Deadline: ${formatDate(project.deadline)}`,
    `Tasks: ${relatedTasks.map((task) => task.title).join(", ") || "No tasks"}`,
  ].join("\n");

  alert(detail);
};

const resetProjectForm = () => {
  editingProjectId.value = null;
  projectForm.value = {
    name: "",
    clientId: "",
    status: "Planning",
    progress: 0,
    deadline: "",
    budget: 0,
    description: "",
  };
};

const saveTask = () => {
  if (editingTaskId.value) {
    const index = tasks.value.findIndex((task) => task.id === editingTaskId.value);
    if (index !== -1) {
      tasks.value[index] = { ...taskForm.value, id: editingTaskId.value };
      addActivity(`Task updated: ${taskForm.value.title}`);
    }
  } else {
    const newTask = {
      ...taskForm.value,
      id: createId("task"),
    };
    tasks.value.unshift(newTask);
    addActivity(`New task created: ${newTask.title}`);
  }

  resetTaskForm();
};

const editTask = (task) => {
  editingTaskId.value = task.id;
  taskForm.value = { ...task };
};

const cancelTaskEdit = () => {
  resetTaskForm();
};

const deleteTask = (taskId) => {
  if (confirm("Yakin ingin menghapus task ini?")) {
    const taskName = tasks.value.find((task) => task.id === taskId)?.title || "Task";
    tasks.value = tasks.value.filter((task) => task.id !== taskId);
    addActivity(`Task deleted: ${taskName}`);
  }
};

const toggleTaskStatus = (taskId) => {
  const task = tasks.value.find((item) => item.id === taskId);
  if (!task) return;
  task.status = task.status === "Done" ? "In Progress" : "Done";
  addActivity(`Task status changed: ${task.title} -> ${task.status}`);
};

const resetTaskForm = () => {
  editingTaskId.value = null;
  taskForm.value = {
    title: "",
    projectId: "",
    assignedTo: "",
    priority: "Medium",
    status: "To Do",
    deadline: "",
  };
};

const saveClient = () => {
  clientError.value = "";

  const normalizedPhone = clientForm.value.phone.replaceAll(" ", "").replaceAll("-", "");
  const isValidIndonesianPhone = new RegExp("^08[0-9]{8,11}$").test(normalizedPhone);

  if (!isValidIndonesianPhone) {
    clientError.value = "Nomor HP tidak valid. Nomor harus dimulai dari 08 dan berisi 10-13 digit angka.";
    return;
  }

  const newClient = {
    ...clientForm.value,
    phone: normalizedPhone,
    id: createId("client"),
  };

  clients.value.unshift(newClient);
  addActivity(`New client added: ${newClient.name}`);

  clientForm.value = {
    name: "",
    industry: "",
    email: "",
    phone: "",
  };
};

const deleteClient = (clientId) => {
  const hasProject = projects.value.some((project) => project.clientId === clientId);

  if (hasProject) {
    alert("Client ini masih memiliki project. Hapus atau pindahkan project terlebih dahulu.");
    return;
  }

  if (confirm("Yakin ingin menghapus client ini?")) {
    const clientName = getClientName(clientId);
    clients.value = clients.value.filter((client) => client.id !== clientId);
    addActivity(`Client deleted: ${clientName}`);
  }
};

const filteredTasksByStatus = (status) => {
  return filteredTasks.value.filter((task) => task.status === status);
};

const getClientName = (clientId) => {
  return clients.value.find((client) => client.id === clientId)?.name || "Unknown Client";
};

const getProjectName = (projectId) => {
  return projects.value.find((project) => project.id === projectId)?.name || "Unknown Project";
};

const getMemberName = (memberId) => {
  return teamMembers.value.find((member) => member.id === memberId)?.name || "Unknown Member";
};

const getClientProjects = (clientId) => {
  return projects.value.filter((project) => project.clientId === clientId).map((project) => project.name);
};

const getMemberProjects = (memberId) => {
  const projectIds = tasks.value.filter((task) => task.assignedTo === memberId).map((task) => task.projectId);
  return [...new Set(projectIds)].map((id) => getProjectName(id));
};

const addActivity = (text) => {
  activities.value.unshift({
    id: createId("act"),
    text,
    time: new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
};

const downloadReport = () => {
  const report = `RivaFlow SEMANTIC MANAGEMENT REPORT

Total Projects: ${projects.value.length}
Completed Projects: ${completedProjects.value.length}
Open Tasks: ${openTasks.value.length}
Completed Tasks: ${completedTasks.value.length}
Total Clients: ${clients.value.length}
Team Members: ${teamMembers.value.length}
Completed Profit: ${formatCurrency(totalProfit.value)}
Potential Budget: ${formatCurrency(totalRevenue.value)}
Average Progress: ${averageProgress.value}%

Semantic Summary:
Profit hanya dihitung dari project berstatus Completed. Data project tetap terhubung dengan client, task, anggota tim, deadline, dan status sebagai model sederhana web semantik RivaFlow.
`;

  const blob = new Blob([report], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "riva-group-report.txt";
  link.click();
  URL.revokeObjectURL(url);
};

const createId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatShortCurrency = (value) => {
  if (value >= 1000000000) return `${Math.round(value / 1000000000)}B`;
  if (value >= 1000000) return `${Math.round(value / 1000000)}M`;
  return `${value}`;
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDateDay = (date) => {
  return new Date(date).toLocaleDateString("id-ID", { day: "2-digit" });
};

const getDateMonth = (date) => {
  return new Date(date).toLocaleDateString("id-ID", { month: "short" });
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const toRdfKey = (text) => {
  return String(text || "Unknown")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  background: #060606;
  color: #f5f5f5;
}

:global(button),
:global(input),
:global(select),
:global(textarea) {
  font-family: inherit;
}

.app-shell {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(255, 122, 0, 0.035), transparent 260px),
    #060606;
}

.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  padding: 48px 72px;
  align-items: center;
}

.brand-row,
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-mark,
.card-logo {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #ff6a00;
  color: #050505;
  font-weight: 900;
  box-shadow: none;
}

.logo-image {
  width: 54px;
  height: 54px;
  object-fit: contain;
  display: block;
  flex: 0 0 auto;
}

.card-logo-image {
  width: 92px;
  height: 92px;
  object-fit: contain;
  display: block;
  margin: 0 auto 18px;
  filter: drop-shadow(0 0 22px rgba(255, 106, 0, 0.24));
}

.brand-row h1,
.sidebar-brand h1,
.login-card h2 {
  margin: 0;
  letter-spacing: 0.5px;
}

.brand-row span,
.sidebar-brand span,
.login-card span,
.hero-copy span {
  color: #ff7a00;
}

.hero-copy {
  margin-top: 76px;
  max-width: 620px;
}

.eyebrow {
  color: #ff7a00;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 10px;
}

.hero-copy h2 {
  font-size: clamp(52px, 6vw, 86px);
  line-height: 0.95;
  margin: 0;
}

.hero-desc {
  color: #b9b9b9;
  font-size: 18px;
  line-height: 1.7;
  margin: 28px 0;
}

.hero-features {
  display: grid;
  gap: 16px;
  max-width: 540px;
}

.feature-card,
.stat-card,
.panel,
.login-card,
.upgrade-card,
.user-box,
.data-card,
.report-card,
.setting-card,
.message-card,
.kanban-card,
.ontology-card {
  background: rgba(18, 18, 18, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.075);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
}

.feature-card {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 18px;
  border-radius: 20px;
}

.feature-icon,
.stat-icon,
.upgrade-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(255, 122, 0, 0.14);
  color: #ff7a00;
}

.feature-card h3,
.feature-card p,
.panel h3,
.panel p {
  margin: 0;
}

.feature-card p,
.login-card p,
.panel p,
.user-box p,
.upgrade-card p,
.data-card p,
.data-card span,
.kanban-card p,
.kanban-card small,
.message-card small,
.setting-card p {
  color: #a8a8a8;
}

.login-card {
  width: min(100%, 520px);
  justify-self: center;
  padding: 42px;
  border-radius: 30px;
}

.card-logo {
  margin: 0 auto 18px;
}

.login-card h2,
.login-card > p {
  text-align: center;
}

.login-card label,
.data-form label {
  display: block;
  margin: 18px 0 8px;
  color: #eaeaea;
  font-weight: 600;
}

.input-group,
.data-form input,
.data-form select,
.data-form textarea,
.topbar-actions input,
.panel select {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  outline: 0;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  color: #ff7a00;
}

.input-group input,
.topbar-actions input,
.panel select {
  border: 0;
  background: transparent;
  padding: 16px 0;
  color: #fff;
  outline: 0;
}

.input-group input::placeholder,
.topbar-actions input::placeholder {
  color: #777;
}

.data-form input,
.data-form select,
.data-form textarea {
  padding: 13px 14px;
}

.data-form textarea {
  resize: vertical;
}

.form-hint {
  display: block;
  margin-top: 8px;
  color: #8f8f8f;
  font-size: 12px;
  line-height: 1.5;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 18px 0 26px;
  color: #b8b8b8;
}

.remember {
  display: flex !important;
  align-items: center;
  gap: 8px;
  margin: 0 !important;
}

.login-options a,
.panel a {
  color: #ff7a00;
  text-decoration: none;
  font-weight: 700;
}

.primary-btn,
.upgrade-card button,
.ghost-btn,
.action-cell button,
.card-actions button,
.danger-btn {
  border: 0;
  border-radius: 14px;
  padding: 11px 16px;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  background: #ff6a00;
}

.primary-btn {
  width: 100%;
  padding: 16px 20px;
  font-size: 16px;
  box-shadow: 0 12px 30px rgba(255, 106, 0, 0.28);
}

.register-submit-btn {
  margin-top: 26px;
}

.ghost-btn,
.action-cell button,
.card-actions button {
  background: rgba(255, 255, 255, 0.08);
}

.danger-btn {
  background: rgba(255, 80, 80, 0.18) !important;
  color: #ff8a8a !important;
}

.demo-info {
  margin-top: 16px;
  font-size: 13px;
}

.alert {
  padding: 12px 14px;
  margin: 16px 0;
  border-radius: 14px;
  font-size: 14px;
}

.error-alert {
  background: rgba(255, 80, 80, 0.14);
  color: #ff8a8a;
  border: 1px solid rgba(255, 80, 80, 0.24);
}

.success-alert {
  background: rgba(66, 211, 146, 0.12);
  color: #42d392;
  border: 1px solid rgba(66, 211, 146, 0.22);
}

.auth-switch {
  margin-top: 18px;
  text-align: center;
  color: #aaa;
}

.auth-switch a {
  color: #ff7a00;
  font-weight: 800;
  text-decoration: none;
}

.dashboard-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 8, 8, 0.88);
  overflow-y: auto;
}

.sidebar-brand h1 {
  font-size: 22px;
}

.menu-list {
  margin-top: 36px;
  display: grid;
  gap: 10px;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: #b9b9b9;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}

.menu-item.active,
.menu-item:hover {
  color: #fff;
  background: #ff6a00;
}

.menu-item small {
  margin-left: auto;
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: #ff7a00;
  color: #fff;
}

.upgrade-card {
  margin-top: 36px;
  padding: 18px;
  border-radius: 20px;
}

.upgrade-card button {
  width: 100%;
  margin-top: 12px;
  padding: 11px;
  font-size: 14px;
}

.user-box {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
}

.avatar,
.member-avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff8a00, #ff4d00);
  color: #111;
  font-weight: 900;
}

.member-avatar {
  width: 58px;
  height: 58px;
  margin-bottom: 12px;
}

.member-avatar.small {
  width: 44px;
  height: 44px;
  margin-bottom: 0;
  flex: 0 0 auto;
}

.user-box h4,
.user-box p,
.upgrade-card h3,
.upgrade-card p {
  margin: 0;
}

.main-content {
  padding: 28px 34px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.topbar h2 {
  margin: 0;
  font-size: 34px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-actions input {
  width: 260px;
  padding: 13px 16px;
  background: rgba(255, 255, 255, 0.04);
}

.topbar-actions button {
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  grid-column: span 3;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border-radius: 20px;
}

.stat-card p,
.stat-card h3,
.stat-card span {
  margin: 0;
}

.stat-card h3 {
  font-size: 30px;
}

.stat-card span {
  color: #42d392;
  font-size: 13px;
}

.panel {
  padding: 22px;
  border-radius: 22px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.panel select {
  width: auto;
  padding: 8px 12px;
}

.chart-panel {
  grid-column: span 7;
}

.projects-panel {
  grid-column: span 8;
}

.task-panel {
  grid-column: span 5;
}

.activity-panel {
  grid-column: span 4;
}

.line-chart-card {
  min-height: 300px;
  padding: 20px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 70% 20%, rgba(255, 106, 0, 0.13), transparent 28%),
    rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.055);
}

.chart-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #b9b9b9;
  margin-bottom: 12px;
}

.chart-topline strong {
  color: #ff7a00;
  font-size: 22px;
}

.line-chart-wrap {
  position: relative;
  height: 260px;
  display: grid;
  place-items: center;
}

.line-chart-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.chart-grid-lines line {
  stroke: rgba(255, 255, 255, 0.07);
  stroke-width: 1;
}

.chart-area {
  fill: url(#orangeArea);
}

.chart-line {
  fill: none;
  stroke: #ff6a00;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 10px rgba(255, 106, 0, 0.35));
}

.chart-dot {
  fill: #ff8a1f;
  stroke: #161616;
  stroke-width: 3;
}

.summary-row,
.report-grid,
.settings-grid,
.ontology-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 18px;
}

.summary-row div,
.report-card,
.setting-card,
.ontology-card {
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.report-grid {
  grid-template-columns: repeat(4, 1fr);
}

.report-card strong {
  font-size: 34px;
}

.task-row,
.project-row,
.activity-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.task-row h4,
.task-row p,
.project-row h4,
.project-row p,
.activity-row p {
  margin: 0;
}

.priority {
  margin-left: auto;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.priority.high {
  color: #ff6b35;
  background: rgba(255, 107, 53, 0.15);
}

.priority.medium {
  color: #ffb000;
  background: rgba(255, 176, 0, 0.15);
}

.priority.low {
  color: #42d392;
  background: rgba(66, 211, 146, 0.15);
}

.project-initial {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(255, 106, 0, 0.18);
  color: #ff8a2a;
  font-weight: 900;
}

.project-info {
  flex: 1;
}

.progress-track,
.mini-progress {
  height: 8px;
  margin-top: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.mini-progress {
  width: 90px;
  display: inline-block;
  margin: 0 8px 0 0;
}

.progress-fill,
.mini-progress div {
  height: 100%;
  border-radius: inherit;
  background: #ff6a00;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff7a00;
  box-shadow: 0 0 16px rgba(255, 122, 0, 0.7);
  flex: 0 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 18px;
}

.content-grid.cards-only {
  grid-template-columns: 1fr;
}

.form-panel,
.section-panel,
.table-panel {
  min-height: 520px;
}

.wide-panel {
  min-width: 0;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  vertical-align: top;
}

th {
  color: #ff7a00;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

td small {
  display: block;
  margin-top: 6px;
  color: #9a9a9a;
  max-width: 320px;
}

.status-pill {
  display: inline-flex;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255, 122, 0, 0.12);
  color: #ff9d33;
  font-size: 12px;
  font-weight: 800;
}

.action-cell,
.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 14px;
  overflow-x: auto;
}

.kanban-column {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.kanban-column h4 {
  margin: 0 0 14px;
  color: #ff7a00;
}

.kanban-card {
  padding: 14px;
  border-radius: 16px;
  margin-bottom: 12px;
}

.kanban-title {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 8px;
}

.kanban-card small {
  display: block;
  margin-top: 7px;
}

.card-actions {
  margin-top: 12px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.cards-grid.two-col {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.data-card {
  padding: 22px;
  border-radius: 22px;
}

.data-card h4 {
  margin: 0 0 8px;
}

.data-card span {
  display: block;
  margin-top: 6px;
  font-size: 14px;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.skill-list small {
  padding: 6px 9px;
  border-radius: 999px;
  background: rgba(255, 122, 0, 0.12);
  color: #ff9d33;
}

.semantic-box,
.semantic-report,
.rdf-box {
  margin-top: 18px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 122, 0, 0.08);
  border: 1px solid rgba(255, 122, 0, 0.12);
}

.semantic-box strong,
.semantic-report h4,
.rdf-box h4 {
  color: #ff9d33;
}

.timeline {
  display: grid;
  gap: 14px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.timeline-date {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #ff8a00, #ff4d00);
  color: #111;
}

.timeline-date strong,
.timeline-date small {
  display: block;
  line-height: 1;
}

.message-list,
.activity-list-full {
  display: grid;
  gap: 14px;
}

.message-card {
  display: flex;
  gap: 14px;
  padding: 18px;
  border-radius: 18px;
}

.message-card h4,
.message-card p {
  margin: 0 0 6px;
}

.ontology-grid {
  grid-template-columns: repeat(3, 1fr);
}

.ontology-card h4 {
  color: #ff9d33;
  margin-top: 0;
}

.rdf-box pre {
  overflow-x: auto;
  padding: 18px;
  border-radius: 14px;
  background: #050505;
  color: #f1f1f1;
  line-height: 1.7;
}

.empty-text,
.empty-chart-text {
  padding: 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: #a8a8a8;
}

.empty-chart-text {
  position: relative;
  z-index: 2;
  width: min(100%, 520px);
  text-align: center;
  margin: 0;
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card,
  .chart-panel,
  .projects-panel,
  .task-panel,
  .activity-panel {
    grid-column: span 1;
  }

  .cards-grid,
  .report-grid,
  .ontology-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 32px;
  }

  .dashboard-page {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
  }

  .topbar,
  .topbar-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .topbar-actions input {
    width: 100%;
  }
}

@media (max-width: 700px) {
  .dashboard-grid,
  .summary-row,
  .cards-grid,
  .cards-grid.two-col,
  .report-grid,
  .settings-grid,
  .ontology-grid {
    grid-template-columns: 1fr;
  }

  .chart-panel,
  .projects-panel,
  .task-panel,
  .activity-panel {
    grid-column: span 1;
  }

  .hero-copy h2 {
    font-size: 48px;
  }

  .main-content {
    padding: 22px;
  }
}
/* =========================
   CUSTOM SCROLLBAR THEME
   RivaFlow: BLACK ORANGE
   ========================= */
:global(*) {
  scrollbar-width: thin;
  scrollbar-color: #ff6a00 #0b0b0b;
}

:global(::-webkit-scrollbar) {
  width: 10px;
  height: 10px;
}

:global(::-webkit-scrollbar-track) {
  background: #0b0b0b;
  border-radius: 999px;
}

:global(::-webkit-scrollbar-thumb) {
  background: linear-gradient(180deg, #ff8a00, #ff5a00);
  border-radius: 999px;
  border: 2px solid #0b0b0b;
}

:global(::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(180deg, #ff9f2a, #ff6a00);
}

:global(::-webkit-scrollbar-corner) {
  background: #0b0b0b;
}

.sidebar::-webkit-scrollbar,
.table-wrap::-webkit-scrollbar,
.kanban-board::-webkit-scrollbar,
.rdf-box pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.sidebar::-webkit-scrollbar-track,
.table-wrap::-webkit-scrollbar-track,
.kanban-board::-webkit-scrollbar-track,
.rdf-box pre::-webkit-scrollbar-track {
  background: #080808;
  border-radius: 999px;
}

.sidebar::-webkit-scrollbar-thumb,
.table-wrap::-webkit-scrollbar-thumb,
.kanban-board::-webkit-scrollbar-thumb,
.rdf-box pre::-webkit-scrollbar-thumb {
  background: #ff6a00;
  border-radius: 999px;
  border: 2px solid #080808;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.table-wrap::-webkit-scrollbar-thumb:hover,
.kanban-board::-webkit-scrollbar-thumb:hover,
.rdf-box pre::-webkit-scrollbar-thumb:hover {
  background: #ff8a26;
}
</style>
