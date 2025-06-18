
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, Tags } from "lucide-react"

interface Category {
  id: string
  name: string
  nameHindi: string
  description: string
  articleCount: number
  isActive: boolean
  createdAt: string
}

const CategoryManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Mock data
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Politics",
      nameHindi: "राजनीति",
      description: "Political news and government updates",
      articleCount: 145,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Sports",
      nameHindi: "खेल",
      description: "Sports news, matches, and player updates",
      articleCount: 89,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "3", 
      name: "Technology",
      nameHindi: "प्रौद्योगिकी",
      description: "Tech news, gadgets, and innovations",
      articleCount: 67,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "4",
      name: "Entertainment",
      nameHindi: "मनोरंजन", 
      description: "Movies, TV shows, celebrity news",
      articleCount: 234,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "5",
      name: "Business",
      nameHindi: "व्यापार",
      description: "Business news, market updates, economy",
      articleCount: 112,
      isActive: false,
      createdAt: "2024-01-01T00:00:00Z",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    nameHindi: "",
    description: "",
    isActive: true,
  })

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const newCategory: Category = {
      id: Date.now().toString(),
      ...formData,
      articleCount: 0,
      createdAt: new Date().toISOString(),
    }
    setCategories([newCategory, ...categories])
    setFormData({ name: "", nameHindi: "", description: "", isActive: true })
    setIsCreateDialogOpen(false)
  }

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    setCategories(categories.map(category =>
      category.id === editingCategory.id
        ? { ...category, ...formData }
        : category
    ))
    setFormData({ name: "", nameHindi: "", description: "", isActive: true })
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id))
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      nameHindi: category.nameHindi,
      description: category.description,
      isActive: category.isActive,
    })
  }

  const toggleCategoryStatus = (id: string) => {
    setCategories(categories.map(category =>
      category.id === id
        ? { ...category, isActive: !category.isActive }
        : category
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
          <p className="text-muted-foreground">
            Create and manage news categories with multi-language support
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name (English) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Technology"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nameHindi">Category Name (Hindi) *</Label>
                <Input
                  id="nameHindi"
                  value={formData.nameHindi}
                  onChange={(e) => setFormData({...formData, nameHindi: e.target.value})}
                  placeholder="e.g., प्रौद्योगिकी"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the category"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Category</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Tags className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.filter(c => c.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Tags className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.articleCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage your news categories and their multi-language names
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Hindi Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="font-hindi">{category.nameHindi}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-muted-foreground">
                        {category.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.articleCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleCategoryStatus(category.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog 
                          open={editingCategory?.id === category.id} 
                          onOpenChange={(open) => !open && setEditingCategory(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(category)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditCategory} className="space-y-4">
                              <div>
                                <Label htmlFor="edit-name">Category Name (English) *</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-nameHindi">Category Name (Hindi) *</Label>
                                <Input
                                  id="edit-nameHindi"
                                  value={formData.nameHindi}
                                  onChange={(e) => setFormData({...formData, nameHindi: e.target.value})}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Input
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="edit-isActive"
                                  checked={formData.isActive}
                                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                />
                                <Label htmlFor="edit-isActive">Active</Label>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                                  Cancel
                                </Button>
                                <Button type="submit">Update Category</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={category.articleCount > 0}
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

export default CategoryManagement
