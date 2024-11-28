"use client";
import { FC, ReactNode, Suspense, useEffect } from "react";
import NextAdapterApp from "next-query-params/app";
import { QueryParamProvider } from "use-query-params";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";

interface ProviderProps {
  children: ReactNode;
}
const queryClient = new QueryClient();

const Provider: FC<ProviderProps> = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    const loginTime = sessionStorage.getItem("loginTime");
    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000;

    const checkSession = () => {
      if (loginTime) {
        if (currentTime - parseInt(loginTime) > oneHour) {
          console.log("hi");
          router.push("/");
          sessionStorage.removeItem("loginTime");
          sessionStorage.removeItem("isLoggedIn");
        }
      } else {
        router.push("/");
        sessionStorage.removeItem("loginTime");
        sessionStorage.removeItem("isLoggedIn");
      }
    };
    const interval = setInterval(checkSession, oneHour);
    return () => clearInterval(interval);
  }, [router]);
  return (
    <div className='block'>
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <QueryParamProvider adapter={NextAdapterApp}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </QueryParamProvider>
        </Suspense>
      </QueryClientProvider>
    </div>
  );
};

export default Provider;
