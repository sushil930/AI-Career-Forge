
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Edit, FileText, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MyResumes() {
  // Mock resume data
  const resumes = [
    {
      id: 1,
      title: "Software Developer Resume",
      score: 85,
      lastModified: "2025-03-15",
      template: "Modern"
    },
    {
      id: 2,
      title: "Frontend Engineer",
      score: 75,
      lastModified: "2025-03-10",
      template: "Professional"
    },
    {
      id: 3,
      title: "Product Manager",
      score: 90,
      lastModified: "2025-04-01",
      template: "Executive"
    }
  ];

  const handleDelete = (id: number) => {
    toast.success(`Resume ${id} deleted`);
  };

  const handleEdit = (id: number) => {
    toast.info(`Editing resume ${id}`);
  };

  const handleDownload = (id: number) => {
    toast.success(`Downloading resume ${id}`);
  };

  const handleClone = (id: number) => {
    toast.success(`Resume ${id} cloned`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Resumes</h2>
          <p className="text-muted-foreground">Manage all your resumes in one place</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {resume.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(resume.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleClone(resume.id)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Clone
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(resume.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(resume.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{resume.template}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-theme-blue">{resume.score}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Last modified: {resume.lastModified}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" size="sm" onClick={() => handleEdit(resume.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload(resume.id)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
