
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import NewsForm from "@/components/NewsForm"

interface NewsArticle {
  id: string
  title: string
  summary: string
  category: string
  language: string
  status: "published" | "draft"
  views: number
  createdAt: string
  thumbnail?: string
}

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)

  // Mock data
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: "1",
      title: "Breaking: New Technology Breakthrough in AI",
      summary: "Scientists announce major advancement in artificial intelligence that could revolutionize healthcare and education sectors worldwide.",
      category: "Technology",
      language: "English",
      status: "published",
      views: 15420,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2", 
      title: "भारत में नई राजनीतिक घटनाएं",
      summary: "देश की राजनीति में आने वाले बदलाव और उनका आम जनता पर प्रभाव के बारे में विस्तृत विश्लेषण।",
      category: "Politics",
      language: "Hindi", 
      status: "draft",
      views: 0,
      createdAt: "2024-01-14T15:45:00Z",
    },
    {
      id: "3",
      title: "Sports Championship Finals Results",
      summary: "Complete coverage of the championship finals with player statistics, highlights, and post-game analysis from experts.",
      category: "Sports",
      language: "English",
      status: "published", 
      views: 8932,
      createdAt: "2024-01-13T20:15:00Z",
    },
  ])

  const categories = ["All", "Politics", "Sports", "Technology", "Entertainment", "Business"]
  const languages = ["All", "English", "Hindi"]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesLanguage = selectedLanguage === "all" || article.language.toLowerCase() === selectedLanguage.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesLanguage
  })

  const handleCreateArticle = (articleData: any) => {
    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      ...articleData,
      views: 0,
      createdAt: new Date().toISOString(),
    }
    setArticles([newArticle, ...articles])
    setIsCreateDialogOpen(false)
  }

  const handleEditArticle = (articleData: any) => {
    setArticles(articles.map(article => 
      article.id === editingArticle?.id 
        ? { ...article, ...articleData }
        : article
    ))
    setEditingArticle(null)
  }

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id))
  }

  const getStatusBadge = (status: string) => {
    return status === "published" ? (
      <Badge className="bg-green-100 text-green-800">Published</Badge>
    ) : (
      <Badge variant="secondary">Draft</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">News Management</h2>
          <p className="text-muted-foreground">
            Create, edit, and manage news articles
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
            </DialogHeader>
            <NewsForm onSubmit={handleCreateArticle} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {languages.map(language => (
                  <option key={language} value={language.toLowerCase()}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredArticles.length})</CardTitle>
          <CardDescription>
            Manage your news articles and their publication status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-xs">
                        <p className="truncate">{article.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {article.summary}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>{article.language}</TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog 
                          open={editingArticle?.id === article.id} 
                          onOpenChange={(open) => !open && setEditingArticle(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingArticle(article)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Article</DialogTitle>
                            </DialogHeader>
                            <NewsForm 
                              initialData={editingArticle} 
                              onSubmit={handleEditArticle}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewsManagement
