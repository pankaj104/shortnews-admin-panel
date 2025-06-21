import { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Edit, Trash2, Eye, AlertCircle, Loader2 } from "lucide-react"
import NewsForm from "@/components/NewsForm"
import { newsService, NewsArticle } from "@/lib/newsService"

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = ["All", "Politics", "Sports", "Technology", "Entertainment", "Business", "Health", "Science"]
  const languages = ["All", "English", "Hindi"]

  // Load articles from Firebase
  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedArticles = await newsService.getArticles()
      setArticles(fetchedArticles)
    } catch (err) {
      setError('Failed to load articles. Please try again.')
      console.error('Error loading articles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesLanguage = selectedLanguage === "all" || article.language.toLowerCase() === selectedLanguage.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesLanguage
  })

  const handleCreateArticle = async (articleData: any) => {
    try {
      setError(null)
      const newArticleId = await newsService.createArticle(articleData)
      await loadArticles() // Refresh the list
      setIsCreateDialogOpen(false)
    } catch (err) {
      setError('Failed to create article. Please try again.')
      console.error('Error creating article:', err)
    }
  }

  const handleEditArticle = async (articleData: any) => {
    if (!editingArticle?.id) return
    
    try {
      setError(null)
      await newsService.updateArticle(editingArticle.id, articleData)
      await loadArticles() // Refresh the list
    setEditingArticle(null)
    } catch (err) {
      setError('Failed to update article. Please try again.')
      console.error('Error updating article:', err)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    
    try {
      setError(null)
      await newsService.deleteArticle(id)
      await loadArticles() // Refresh the list
    } catch (err) {
      setError('Failed to delete article. Please try again.')
      console.error('Error deleting article:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "published" ? (
      <Badge className="bg-green-100 text-green-800">Published</Badge>
    ) : (
      <Badge variant="secondary">Draft</Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading articles...</p>
        </div>
      </div>
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {articles.length === 0 ? 'No articles found. Create your first article!' : 'No articles match your current filters.'}
              </p>
            </div>
          ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead>Article</TableHead>
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
                        <div className="flex items-start space-x-3 max-w-md">
                          {article.thumbnail && (
                            <div className="flex-shrink-0">
                              <img
                                src={article.thumbnail}
                                alt={article.title}
                                className="w-16 h-16 object-cover rounded-md border bg-gray-100"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-16 h-16 bg-gray-200 rounded-md border flex items-center justify-center text-xs text-gray-500">No Image</div>';
                                  }
                                }}
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold">{article.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {article.summary}
                        </p>
                          </div>
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
                        {article.createdAt instanceof Date 
                          ? article.createdAt.toLocaleDateString()
                          : article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()
                        }
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
                            onClick={() => handleDeleteArticle(article.id!)}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default NewsManagement
