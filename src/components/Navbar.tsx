'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Bot,
  Code,
  FileText,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  History,
  HelpCircle,
  Zap,
  Globe,
  Shield,
  Sparkles
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      description: "Main agent interface"
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Performance metrics",
      badge: "New"
    },
    {
      title: "History",
      href: "/history",
      icon: History,
      description: "Chat history and logs"
    }
  ];

  const agentNavItems: NavItem[] = [
    {
      title: "GPT-4o",
      href: "/agents/gpt4o",
      icon: Bot,
      description: "OpenAI's multimodal model"
    },
    {
      title: "Claude 3.5 Sonnet",
      href: "/agents/claude",
      icon: FileText,
      description: "Anthropic's reasoning model"
    },
    {
      title: "Gemini 1.5 Pro",
      href: "/agents/gemini",
      icon: Code,
      description: "Google's coding specialist"
    }
  ];

  const resourceNavItems: NavItem[] = [
    {
      title: "API Documentation",
      href: "/docs",
      icon: FileText,
      description: "Complete API reference"
    },
    {
      title: "Help Center",
      href: "/help",
      icon: HelpCircle,
      description: "Get support and tutorials"
    },
    {
      title: "Status",
      href: "/status",
      icon: Zap,
      description: "System status and uptime"
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/75">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">MetaAgent</span>
              <span className="text-xs text-white/60 -mt-1">AI Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {/* Main Navigation */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10">
                    <Home className="mr-2 h-4 w-4" />
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <Brain className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Meta-Agent Platform
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Intelligent routing across multiple LLM providers for optimal responses.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  isActiveRoute(item.href) && "bg-accent text-accent-foreground"
                                )}
                              >
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <div className="text-sm font-medium leading-none">
                                    {item.title}
                                    {item.badge && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Agents Navigation */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10">
                    <Bot className="mr-2 h-4 w-4" />
                    Agents
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {agentNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  isActiveRoute(item.href) && "bg-accent text-accent-foreground"
                                )}
                              >
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <div className="text-sm font-medium leading-none">{item.title}</div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Navigation */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10">
                    <Globe className="mr-2 h-4 w-4" />
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {resourceNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <div className="text-sm font-medium leading-none">{item.title}</div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Status Badge */}
            <Badge variant="outline" className="hidden sm:flex items-center space-x-1 border-green-500/20 bg-green-500/10 text-green-400">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs">Online</span>
            </Badge>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="User" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Security</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <Separator className="my-2" />
            <div className="space-y-2 pb-4">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10",
                      isActiveRoute(item.href) ? "bg-white/10 text-white" : "text-white/80"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
              
              <Separator className="my-2" />
              
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Agents</p>
              </div>
              
              {agentNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10",
                      isActiveRoute(item.href) ? "bg-white/10 text-white" : "text-white/80"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
              
              <Separator className="my-2" />
              
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Resources</p>
              </div>
              
              {resourceNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;