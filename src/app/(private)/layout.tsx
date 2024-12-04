import { SidebarProvider } from "@/components/ui/sidebar";
import { Container, Navbar, SidebarLeft } from "@/components";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <Navbar />
      <Container>{children}</Container>
    </SidebarProvider>
  );
}
