import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ToastContainer from "./Toast";

export default function Layout({ title, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
