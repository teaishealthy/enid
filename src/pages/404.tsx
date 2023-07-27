import { Button } from "@/components/ui/button";
import SiteLayout from "@/layouts/site";

export default function NotFound() {
  return (
    <SiteLayout className="h-screen">
        <div className="flex flex-col items-center justify-center h-[80%]">
            <h1 className="text-5xl font-extrabold">404</h1>
            <h2 className="mt-5 text-3xl font-medium">Page not found</h2>
            <Button className="mt-5" variant="outline" onClick={() => window.history.back()}>
                Go back?
            </Button>
        </div>
        </SiteLayout>
  )
}
