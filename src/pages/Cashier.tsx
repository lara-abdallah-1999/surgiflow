import { WorkspaceNotification } from '../components/layout/WorkspaceNotification';
import { CashierCaseWorkspace } from "../features/cashier/CashierCaseWorkspace";
import { useCashierWorkspace } from '../features/workspaces/Cashier/hooks/useCashierWorkspace';


export default function Cashier() {
  const { directCase, amount, setAmount, submitPayment, navigate, toast, setToast } = useCashierWorkspace();

if (directCase)
  return (
    <>
      <CashierCaseWorkspace
        surgery={directCase}
        amount={amount}
        setAmount={setAmount}
        onPay={submitPayment}
        onBack={() => {
          navigate("/cashier", {
            replace: true,
            state: null,
          });
        }}
      />

      <WorkspaceNotification notice={toast} onClose={() => setToast(null)} />
    </>
  );

}
