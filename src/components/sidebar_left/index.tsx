"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Hotel,
  Building2,
  UsersRound,
  FileSearch,
  User2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { IUserProfile } from "@/utils/types/user.type";
import { useSession } from "next-auth/react";

export function SidebarLeft() {
  const { data: session } = useSession();
  const { open, isMobile } = useSidebar();
  const pathname = usePathname();
  // const status: string = "authenticated";

  const menus = [
    {
      label: "Painel",
      href: `/${
        session?.user.profile === IUserProfile.COMPANY
          ? `dashboard/c/${session.user.companyId}`
          : ""
      }`,
      icon: <LayoutDashboard className="" />,
      pathName: `/${
        session?.user.profile === IUserProfile.COMPANY
          ? `dashboard/c/${session.user.companyId}`
          : ""
      }`,
      allowedProfiles: [
        IUserProfile.ADMIN,
        IUserProfile.COMPANY,
        IUserProfile.INVESTIGATOR,
      ],
    },
    {
      label: "Usuários",
      href: "/usuarios",
      icon: <User2 />,
      pathName: "/usuarios",
      allowedProfiles: [IUserProfile.ADMIN],
    },
    {
      label: "Empresas",
      href: "/empresas",
      icon: <Hotel />,
      pathName: "/empresas",
      allowedProfiles: [IUserProfile.ADMIN],
    },
    {
      label: "Filiais",
      href: "/filiais",
      icon: <Building2 />,
      pathName: "/filiais",
      allowedProfiles: [IUserProfile.ADMIN],
    },
    {
      label: "Candidatos",
      href: "/candidatos",
      icon: <UsersRound />,
      pathName: "/candidatos",
      allowedProfiles: [
        IUserProfile.ADMIN,
        IUserProfile.COMPANY,
        IUserProfile.RH,
      ],
    },
    {
      label: "Consultas",
      href: "/consultas",
      icon: <FileSearch />,
      pathName: "/consultas",
      allowedProfiles: [
        IUserProfile.ADMIN,
        IUserProfile.COMPANY,
        IUserProfile.INVESTIGATOR,
        IUserProfile.RH,
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader className="">
        <Image
          src="/assets/logo.png"
          alt="Grupo FR Facilities"
          className="mx-auto"
          width={120}
          height={30}
        />
        <SidebarTrigger
          className={cn(
            "absolute -right-3 top-[105px] h-6 w-6 rounded-lg bg-primary text-sidebar-accent hover:scale-105 hover:bg-primary/90 hover:text-sidebar-accent md:-right md:top-[105px]",
            { "rotate-180 duration-200 md:top-8": !open || isMobile }
          )}
        />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className={cn("")}>
        {/* GROUP - MENUS */}
        <SidebarGroup className="mt-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menus.map((menu, idx) => {
                if (!menu.allowedProfiles.includes(session?.user.profile))
                  return null;

                return (
                  <SidebarMenuItem key={idx}>
                    {/* {status === "loading" ? (
                      <SidebarMenuSkeleton showIcon />
                    ) : ( */}
                    <SidebarMenuButton
                      asChild
                      tooltip={menu.label}
                      className={cn(
                        "py-6 transition-all duration-300",
                        pathname === menu.pathName
                          ? "bg-background text-primary hover:bg-background hover:text-primary font-bold shadow-md"
                          : "hover:bg-primary hover:text-sidebar-accent"
                      )}
                    >
                      <Link href={menu.href}>
                        {menu.icon}
                        <span>{menu.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {/* )} */}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GROUP - ADMINISTRATIVO */}
        {/* {open || isMobile ? (
          <Collapsible className="group/collapsible">
            <SidebarGroup className={cn("")}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  <span className="flex gap-2">
                    <Circle size={16} />
                    Administrativo
                  </span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuAdm.map((menu, idx) => {
                      return (
                        <SidebarMenuItem key={idx}>
                          {status === "loading" ? (
                            <SidebarMenuSkeleton showIcon />
                          ) : (
                            <SidebarMenuButton
                              asChild
                              tooltip={menu.label}
                              className="hover:bg-primary hover:text-sidebar-accent"
                            >
                              <Link href={menu.href}>
                                {menu.icon}
                                <span>{menu.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ) : (
          <Menubar className={cn("mx-auto border-0 bg-inherit p-0")}>
            <MenubarMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MenubarTrigger className="rounded-md p-2 hover:cursor-pointer hover:bg-primary hover:text-sidebar-accent data-[state=open]:bg-primary data-[state=open]:text-sidebar-accent">
                    <Circle size={16} />
                  </MenubarTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Administrativo</p>
                </TooltipContent>
              </Tooltip>

              <MenubarContent side="right" align="end">
                {menuAdm.map((menu, idx) => {
                  return (
                    <>
                      <MenubarItem
                        key={idx}
                        className="focus:bg-gradient-to-r focus:from-primary focus:to-primary/70 focus:text-sidebar-accent"
                      >
                        <Link
                          href={menu.href}
                          className="flex items-center gap-2"
                        >
                          {menu.icon}
                          <span>{menu.label}</span>
                        </Link>
                      </MenubarItem>

                      {idx < menuAdm.length - 1 && <MenubarSeparator />}
                    </>
                  );
                })}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )} */}
      </SidebarContent>
    </Sidebar>
  );
}
