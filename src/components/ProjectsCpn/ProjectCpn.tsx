import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectCpn = () => {
  return (
    <Card className="w-full basis:auto lg:basis-full rounded-sm p-2">
      <CardHeader>
        <div>
          <h1>Assigned Tasks</h1>
          <span>(14)</span>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default ProjectCpn;
