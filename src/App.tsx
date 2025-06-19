import { ContractViewer } from "./components/ContractViewer";
import { sampleContract } from "./data/sampleContract";

function App() {
  return <ContractViewer contract={sampleContract} />;
}

export default App;
