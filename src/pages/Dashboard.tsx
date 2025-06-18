
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { FileText, Users, Eye, TrendingUp } from "lucide-react"

const Dashboard = () => {
  // Mock data for charts
  const dailyViews = [
    { date: "Mon", views: 2400, articles: 12 },
    { date: "Tue", views: 1398, articles: 8 },
    { date: "Wed", views: 9800, articles: 15 },
    { date: "Thu", views: 3908, articles: 10 },
    { date: "Fri", views: 4800, articles: 18 },
    { date: "Sat", views: 3800, articles: 14 },
    { date: "Sun", views: 4300, articles: 16 },
  ]

  const categoryData = [
    { name: "Politics", value: 35, color: "#8884d8" },
    { name: "Sports", value: 25, color: "#82ca9d" },
    { name: "Tech", value: 20, color: "#ffc658" },
    { name: "Entertainment", value: 15, color: "#ff7c7c" },
    { name: "Business", value: 5, color: "#8dd1e1" },
  ]

  const languageData = [
    { language: "English", articles: 450, readers: 12500 },
    { language: "Hindi", articles: 320, readers: 8200 },
  ]

  const stats = [
    {
      title: "Total Articles",
      value: "1,234",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Readers",
      value: "20,847",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Views",
      value: "156,789",
      change: "+23%",
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Engagement Rate",
      value: "68.5%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your news platform performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Views & Articles</CardTitle>
            <CardDescription>
              Content performance over the last week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="articles" fill="#82ca9d" name="Articles" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Article distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Language Performance</CardTitle>
            <CardDescription>
              Articles and readers by language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={languageData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="language" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="articles" fill="#8884d8" name="Articles" />
                <Bar dataKey="readers" fill="#82ca9d" name="Readers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement Trend</CardTitle>
            <CardDescription>
              User engagement over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
