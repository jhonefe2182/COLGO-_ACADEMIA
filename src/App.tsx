import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { EstudiantesPage } from "./pages/EstudiantesPage";
import { CursosPage } from "./pages/CursosPage";
import { PagosPage } from "./pages/PagosPage";
import { SedesPage } from "./pages/SedesPage";
import { MatriculasPage } from "./pages/MatriculasPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="estudiantes" element={<EstudiantesPage />} />
        <Route path="cursos" element={<CursosPage />} />
        <Route path="pagos" element={<PagosPage />} />
        <Route path="sedes" element={<SedesPage />} />
        <Route path="matriculas" element={<MatriculasPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;