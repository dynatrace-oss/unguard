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
import { ROUTES } from '@/app/enums/routes';

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
    return (
        <Navbar
            style={{
                backgroundColor: "#4ab973",
                color: "#f1f1f1",
                borderRadius: "15px",
            }}
        >
            <NavbarBrand>
                <UnguardLogo />
                <p className="font-bold text-inherit">Unguard</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="secondary" href={ROUTES.home}>
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="secondary" href={ROUTES.users}>
                        Users
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="secondary" href={ROUTES.mytimeline}>
                        My Timeline
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button
                        as={Link}
                        color="default"
                        href={ROUTES.login}
                        variant="solid"
                    >
                        Login/Register
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
