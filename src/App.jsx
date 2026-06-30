import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CourseListPage from "./components/CourseListPage";
import CourseDetailsPage from "./components/CourseDetailsPage";
import VideoPage from "./components/VideoPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/video" element={<VideoPage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
