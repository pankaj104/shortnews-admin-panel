import { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Tags, AlertCircle, Loader2 } from "lucide-react"
import { categoryService, Category } from "@/lib/categoryService"

type CategoryWithCount = Category & { articleCount: number }

const CategoryManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    nameHindi: "",
    description: "",
    isActive: true,
  })

  // Load categories from Firebase
  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First, try to seed initial categories if none exist
      await categoryService.seedInitialCategories()
      
      const fetchedCategories = await categoryService.getAllCategoriesWithCounts()
      setCategories(fetchedCategories)
    } catch (err) {
      setError('Failed to load categories. Please try again.')
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      await categoryService.createCategory(formData)
      await loadCategories() // Refresh the list
    setFormData({ name: "", nameHindi: "", description: "", isActive: true })
    setIsCreateDialogOpen(false)
    } catch (err) {
      setError('Failed to create category. Please try again.')
      console.error('Error creating category:', err)
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory?.id) return

    try {
      setError(null)
      await categoryService.updateCategory(editingCategory.id, formData)
      await loadCategories() // Refresh the list
    setFormData({ name: "", nameHindi: "", description: "", isActive: true })
    setEditingCategory(null)
    } catch (err) {
      setError('Failed to update category. Please try again.')
      console.error('Error updating category:', err)
    }
  }

  const handleDeleteCategory = async (category: CategoryWithCount) => {
    if (category.articleCount > 0) {
      setError('Cannot delete category with existing articles. Please move or delete the articles first.')
      return
    }

    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return

    try {
      setError(null)
      if (category.id) {
        await categoryService.deleteCategory(category.id)
        await loadCategories() // Refresh the list
      }
    } catch (err) {
      setError('Failed to delete category. Please try again.')
      console.error('Error deleting category:', err)
    }
  }

  const openEditDialog = (category: CategoryWithCount) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      nameHindi: category.nameHindi,
      description: category.description,
      isActive: category.isActive,
    })
  }

  const toggleCategoryStatus = async (category: CategoryWithCount) => {
    try {
      setError(null)
      if (category.id) {
        await categoryService.updateCategory(category.id, {
          isActive: !category.isActive
        })
        await loadCategories() // Refresh the list
      }
    } catch (err) {
      setError('Failed to update category status. Please try again.')
      console.error('Error updating category status:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading categories...</p>
        </div>
      </div>
    )
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No categories found. Create your first category!
              </p>
            </div>
          ) : (
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
                          onClick={() => toggleCategoryStatus(category)}
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
                            onClick={() => handleDeleteCategory(category)}
                          className="text-red-600 hover:text-red-700"
                          disabled={category.articleCount > 0}
                            title={category.articleCount > 0 ? "Cannot delete category with articles" : "Delete category"}
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

export default CategoryManagement
