
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categoryService } from "@/lib/categoryService"

interface NewsFormProps {
  initialData?: any
  onSubmit: (data: any) => void
}

const NewsForm = ({ initialData, onSubmit }: NewsFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    summary: initialData?.summary || "",
    category: initialData?.category || "",
    language: initialData?.language || "",
    status: initialData?.status || "draft",
    thumbnail: initialData?.thumbnail || "",
  })

  const [autoSummary, setAutoSummary] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  const languages = ["English", "Hindi"]

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await categoryService.getCategories()
        const activeCategories = fetchedCategories
          .filter(cat => cat.isActive)
          .map(cat => cat.name)
        setCategories(activeCategories)
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback to default categories if Firebase fails
        setCategories(["Politics", "Sports", "Technology", "Entertainment", "Business", "Health", "Science"])
      }
    }

    loadCategories()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let finalSummary = formData.summary
    if (autoSummary && formData.content) {
      // Simple auto-summary: take first 60 words
      const words = formData.content.split(' ').slice(0, 60)
      finalSummary = words.join(' ') + (words.length === 60 ? '...' : '')
    }

    onSubmit({
      ...formData,
      summary: finalSummary,
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateAutoSummary = () => {
    if (formData.content)  {
      const words = formData.content.split(' ').slice(0, 60)
      const summary = words.join(' ') + (words.length === 60 ? '...' : '')
      handleInputChange('summary', summary)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter article title"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Language *</Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => handleInputChange('thumbnail', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {formData.thumbnail && (
              <div className="mt-3">
                <Label className="text-sm text-muted-foreground">Preview:</Label>
                <div className="mt-1">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="w-32 h-32 object-cover rounded-md border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const errorMsg = e.currentTarget.nextSibling as HTMLElement;
                      if (errorMsg) errorMsg.style.display = 'block';
                    }}
                    onLoad={(e) => {
                      const errorMsg = e.currentTarget.nextSibling as HTMLElement;
                      if (errorMsg) errorMsg.style.display = 'none';
                    }}
                  />
                  <p className="text-xs text-red-500 mt-1 hidden">
                    Failed to load image. Please check the URL.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.status === "published"}
              onCheckedChange={(checked) => 
                handleInputChange('status', checked ? 'published' : 'draft')
              }
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="content">Full Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write the full article content here..."
              className="min-h-[200px]"
              required
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summary (Max 60 words)</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-summary"
                  checked={autoSummary}
                  onCheckedChange={setAutoSummary}
                />
                <Label htmlFor="auto-summary" className="text-sm">Auto-generate from content</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAutoSummary}
                  disabled={!formData.content}
                >
                  Generate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="Enter article summary (max 60 words)..."
                className="min-h-[100px]"
                disabled={autoSummary}
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Words: {formData.summary.split(' ').filter(word => word.length > 0).length}/60
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" variant="default">
          {initialData ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  )
}

export default NewsForm
