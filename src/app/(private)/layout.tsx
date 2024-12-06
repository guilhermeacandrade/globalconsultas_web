import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Navbar, SidebarLeft } from "@/components";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset className="p-2 ">
        <Navbar />
        <div className=" px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
