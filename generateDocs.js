const fs = require('fs');
const path = require('path');

const models = JSON.parse(fs.readFileSync('modelDocs.json', 'utf8'));
const routes = JSON.parse(fs.readFileSync('routeDocs.json', 'utf8'));

const outputPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d2d66586-ba6f-4141-af5b-210c45c796d5\\full_stack_documentation.md';

let doc = `# JustFiveCRM - Single Source of Truth Documentation

*Generated based on actual source code verification.*

## 1. Frontend Structure
\`\`\`
frontend/
├── src/
│   ├── api/          # Axios config and endpoint definitions
│   ├── assets/       # Static assets (images, icons)
│   ├── components/   # Reusable UI components
│   ├── config/       # Routes mapping, permissions, and app config
│   ├── context/      # React Contexts (Auth, Language, Notifications, Calendar)
│   ├── data/         # Mock data / seeders (if any)
│   ├── hooks/        # Custom React hooks
│   ├── layouts/      # Dashboard layouts for different roles
│   ├── lib/          # Utilities (tokenManager.js, formatters)
│   ├── mappers/      # Data transformation (toFrontend, toBackend)
│   ├── pages/        # Route components separated by role (director, teacher, etc.)
│   ├── services/     # API repositories bridging UI and backend
│   └── utils/        # Generic helper functions
\`\`\`

## 2. Backend Structure
\`\`\`
backend/
├── src/
│   ├── config/       # Sequelize & Environment configurations
│   ├── controllers/  # Request parsing and standard response generation
│   ├── middlewares/  # authMiddleware, rbacMiddleware, globalErrorHandler
│   ├── models/       # Sequelize database schemas and associations
│   ├── repositories/ # Direct DB queries extending BaseRepository
│   ├── routes/       # Express Router definitions
│   ├── services/     # Business logic, pagination, filtering extending BaseService
│   ├── swagger/      # OpenAPI documentation specs
│   └── utils/        # Logger (Winston), response formatting
\`\`\`

## 3. Database Models & Relationships
`;

models.forEach(m => {
  doc += `### \`${m.name}\`\n`;
  doc += `- **Attributes**: ${m.attributes.join(', ')}\n`;
  if (m.associations.length > 0) {
    doc += `- **Associations**: ${m.associations.join(', ')}\n`;
  } else {
    doc += `- **Associations**: None\n`;
  }
  doc += '\n';
});

doc += `## 4. API Endpoints
`;

const routeGroups = {};
routes.forEach(r => {
  if (!routeGroups[r.file]) routeGroups[r.file] = [];
  routeGroups[r.file].push(r);
});

for (const file in routeGroups) {
  doc += `### ${file}\n`;
  routeGroups[file].forEach(r => {
    doc += `- \`[${r.method}]\` ${r.route}\n`;
  });
  doc += '\n';
}

doc += `## 5. Middlewares
- **authMiddleware**: Extracts JWT from Authorization header, verifies it via \`jsonwebtoken\`, attaches \`req.user\`.
- **rbacMiddleware**: \`checkRole(allowedRoles)\`. Compares \`req.user.role\` against \`allowedRoles\`. Throws 403 Forbidden if mismatched.
- **helmet / cors / express-rate-limit**: Standard security guards in \`app.js\`.
- **Global Error Handler**: Catches next(error), logs stack via Winston, and sends standardized 500 error response.

## 6. Services & Repositories
- **BaseRepository**: Provides \`findAll\`, \`findById\`, \`create\`, \`update\`, \`delete\` executing standard Sequelize operations.
- **BaseService**: Implements advanced logic like pagination, filtering (\`allowedFilters\`), sorting, and audit logging. Calls Repository methods.

## 7. Frontend Contexts, Mappers, and API Repositories
- **Contexts**:
  - \`AuthContext\`: Holds \`token\`, \`currentRole\`, \`user\`. Handles \`login\` / \`logout\`.
  - \`LanguageContext\`: Handles i18n locales.
  - \`NotificationContext\`: Socket.io connectivity state.
- **Mappers**: Transform snake_case DB fields to camelCase UI fields (\`toFrontend\`) and vice versa (\`toBackend\`). **CRITICAL**: Failing to map fields properly leads to \`notNull Violation\` on the backend.
- **API Repositories**: Extend \`BaseRepository\` on the frontend, standardizing CRUD calls using \`axiosConfig.js\`.

## 8. Data Flow
1. **React UI**: User triggers action (e.g., Form Submit).
2. **Mapper**: UI object is passed to \`Mapper.toBackend(data)\` to conform to DB schema.
3. **Axios Client**: \`apiClient\` intercepts, attaches \`Bearer <token>\`, and makes HTTP request.
4. **Backend Router & Middleware**: Express router matches path -> \`authMiddleware\` verifies token -> \`rbacMiddleware\` verifies role.
5. **Controller**: Validates \`req.body\`.
6. **Service & Repository**: Service handles business logic -> Repository runs Sequelize query -> Database commits.
7. **Response**: Controller uses \`successResponse\` / \`errorResponse\`.
8. **Axios Response Interceptor**: Extracts \`data\` from \`{success: true, data: {...}}\`.
9. **UI Feedback**: React re-renders, Sonner \`toast\` shows success or error.

## 9. Environment Variables
- **Backend**: \`PORT\`, \`DB_HOST\`, \`DB_USER\`, \`DB_PASSWORD\`, \`DB_NAME\`, \`JWT_SECRET\`, \`JWT_REFRESH_SECRET\`, \`DATABASE_URL\`, \`FRONTEND_URL\`.
- **Frontend**: \`VITE_API_URL\` (Backend base URL).

## 10. Railway Deployment (Production Ready)
- \`process.env.DATABASE_URL\` natively supported by Sequelize config.
- SSL connection forced for PostgreSQL (\`rejectUnauthorized: false\`).
- Winston console logging strictly enabled for \`/stdout\` aggregation.
- Uncaught Exception listeners prevent silent zombie crashing (502 Gateway).
- \`/health\` pings database via \`sequelize.authenticate()\` for Zero-Downtime Deployments.

## 11. Troubleshooting
- **401 Unauthorized**: JWT expired. Axios interceptor attempts \`/auth/refresh\`. If it fails, redirects to \`/login\`.
- **403 Forbidden**: Role mismatch in \`rbacMiddleware\`. Ensure frontend route `allowedRoles` matches backend.
- **notNull Violation**: The Mapper omitted a required DB column. Update \`toBackend()\` in the relevant mapper.
- **ENOTFOUND postgres**: \`DATABASE_URL\` is missing, or the app is trying to connect to Railway Internal network from local.

## 12. Known Limitations & Tech Debt
- Soft deletes are not universally implemented across all models.
- The `Courses` frontend form must explicitly provide a `price` input to satisfy the DB constraint.

---
*End of Documentation.*`;

fs.writeFileSync(outputPath, doc);
console.log('Documentation written successfully to', outputPath);
