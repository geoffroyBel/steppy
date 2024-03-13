import AuthProvider from "./AuthProvider";
import StepProvider from "./StepProvider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <StepProvider>{children}</StepProvider>
    </AuthProvider>
  );
};
export default Providers;
