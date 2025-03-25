"use client";

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Image,
} from "@heroui/react";
import { usePathname } from "next/navigation";

export function UnguardLogo() {
    return (
        <Image
            alt="Unguard Logo"
            height="32"
            src={`/ui/unguard_logo.svg`}
            width="32"
        />
    );
}

export default function NavigationBar() {
    const pathname = usePathname();

    return (
        <Navbar
            maxWidth={"full"}
            style={{
                backgroundColor: "#4ab973",
                color: "#f1f1f1",
                borderRadius: "15px",
            }}
        >
            <NavbarBrand className="max-w-36">
                <UnguardLogo />
                <p className="font-bold text-inherit px-2 text-large">
                    Unguard
                </p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link
                        className={`${pathname === "/" && "font-extrabold"}`}
                        color="secondary"
                        href="/"
                    >
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link
                        className={`${pathname === "/users" && "font-extrabold"}`}
                        color="secondary"
                        href="/users"
                    >
                        Users
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link
                        className={`${pathname === "/mytimeline" && "font-extrabold"}`}
                        color="secondary"
                        href="/mytimeline"
                    >
                        My Timeline
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="justify-items-end">
                    <Button
                        as={Link}
                        color="default"
                        href="/login"
                        variant="solid"
                    >
                        Login/Register
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
