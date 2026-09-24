# Flow CRM

---

A MERN Stack Flow CRM system to manage leads, assign sales agents, track lead status, and analyze performance through dashboards and reports. <br>
Build with a React frontend, Express/Node backend, MongoDB database.

---

## Demo Link

[Live Demo](https://anvaya-flow-uwge.vercel.app/)

---

## Quick Start

```
git clone https://github.com/Sourabhpande532/FlowCRM
cd ANVAYA_FLOW
npm install
npm run dev  # or `npm Start` / `yarn dev`
```

---

## Technologies

- React Js
- React Router
- Node Js
- Express Js
- MongoDB
- RESTful APIs

---

## Demo Video

Watch a walkthrough (5-7 minutes) of all major features of this app: <br>
[Drive Video Link](https://drive.google.com/file/d/1QB2OmRQmD42xffJOz2KtHc2u554_X0VX/view)

---

## Features

**Dashboard**

- Overview of all leads with status-based analytics
- Quick filters for `status`, `source`, `agent`, and tags

**Lead Management**

- `Create`, `view`, `update`, and `delete` leads with details like `status`, `source`,`tags`,and assigned sales agent
- View lead details and manage lead data efficiently

**Sales Agent Management**

- Manage sales agents with basic information
- Assign and reassign leads to agents easily

**Lead Status Tracking**

- Track leads through defined stages: `New`, `Contacted`, `Qualified`, `Proposal Sent`, `Closed`
- Ensures clear visibility of lead progress

**Reports**

- Charts and summaries for lead performance
- Insights such as leads closed in the last `7 days`

**Notifications**

- Toast notifications for success and error handling

**Responsive UI**

- Mobile and desktop friendly layout for smooth user experience

---

## Reference

![](./assets/anvaya.png)
---
![](./assets/Chart.png)

---

## API Reference

### GET /api/leads

Retrieve all leads with status, priority,assigned agent, and tags.
Sample Response:

```
[
  { _id, name, source, status, priority, salesAgent, tags, timeToClose }
]

```

### GET /api/leads/:id

Fetch details information for a single lead.
Sample Response:

```
{ _id, name, source, status, priority, salesAgent, tags, notes }
```

### POST /api/leads

Create a new lead and assign it to a sales agent.
Sample Response:

```
{ _id, name, status, salesAgent }

```

### DELETE /api/leads/:id

Remove an existing lead from the system.
Sample Response:

```
{ message: "Lead deleted successfully" }

```

### GET /api/agents

List all available sales agents.
Sample Response:

```
[{ _id, name, email }]

```

### POST /api/agents

Add a new sales agent to the platform.
Sample Response:

```
{ _id, name, email }

```

---

## Environment Setup

**Backend(/server/.env)**

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/anvaya

# CORS
CLIENT_URL=http://localhost:3000

```

**Frontend**

```
# API Base URL
REACT_APP_BASE_URL=http://localhost:5000/api

```

---

## Contact

For bugs or feature requests, please reach out to [sourabhpande43@gmail.com](mailto:sourabhpande43@gmail.com)

---
