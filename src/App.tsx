import "./App.css";
import { CobWeb } from "./webcob";

function App() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <CobWeb
        width={1000}
        height={600}
        className=""
      />
    </div>
  );
}

export default App;
