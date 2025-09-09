import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Code } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-border/50 rounded-2xl">
          <CardHeader className="items-center text-center p-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-4 rounded-xl shadow">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-4xl font-headline font-bold tracking-tight text-foreground">
                Next Blank Slate
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8 text-center">
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your Next.js project is ready. Start building something amazing.
            </p>
            <div className="text-left bg-muted/30 p-6 rounded-lg border border-border/50 text-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-accent" />
                How to Get Started
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                This is your starting point. To begin developing your
                application, you can edit this page. The file is located at:
                <br />
                <code className="mt-2 inline-block rounded-md bg-accent/90 px-2 py-1 font-mono text-xs text-accent-foreground">
                  src/app/page.tsx
                </code>
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                For static files like images or fonts, place them inside the{" "}
                <code className="rounded-md bg-accent/90 px-2 py-1 font-mono text-xs text-accent-foreground">
                  public
                </code>{" "}
                directory. They will be served automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
