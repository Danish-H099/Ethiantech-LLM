import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CourseListPage from "./components/CourseListPage";
import CourseDetailsPage from "./components/CourseDetailsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
