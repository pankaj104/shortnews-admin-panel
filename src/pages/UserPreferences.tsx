
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Users, Eye, Heart, Share2 } from "lucide-react"

const UserPreferences = () => {
  // Mock user interaction data
  const categoryEngagement = [
    { category: "Politics", views: 2400, likes: 180, shares: 45, users: 890 },
    { category: "Sports", views: 1800, likes: 220, shares: 65, users: 650 },
    { category: "Technology", views: 1600, likes: 150, shares: 38, users: 580 },
    { category: "Entertainment", views: 2200, likes: 280, shares: 85, users: 720 },
    { category: "Business", views: 900, likes: 75, shares: 20, users: 340 },
  ]

  const languagePreference = [
    { name: "English", value: 65, color: "#8884d8" },
    { name: "Hindi", value: 35, color: "#82ca9d" },
  ]

  const userDemographics = [
    { ageGroup: "18-24", users: 2500, percentage: 25 },
    { ageGroup: "25-34", users: 3200, percentage: 32 },
    { ageGroup: "35-44", users: 2100, percentage: 21 },
    { ageGroup: "45-54", users: 1500, percentage: 15 },
    { ageGroup: "55+", users: 700, percentage: 7 },
  ]

  const topPreferences = [
    { category: "Entertainment", engagement: 92, trend: "+5%" },
    { category: "Sports", engagement: 87, trend: "+12%" },
    { category: "Politics", engagement: 78, trend: "-2%" },
    { category: "Technology", engagement: 74, trend: "+8%" },
    { category: "Business", engagement: 45, trend: "+3%" },
  ]

  const stats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+8%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Avg. Session Time",
      value: "4m 32s",
      change: "+12%",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Engagement Rate",
      value: "73.5%",
      change: "+5%",
      icon: Heart,
      color: "text-red-600",
    },
    {
      title: "Share Rate",
      value: "15.2%",
      change: "+18%",
      icon: Share2,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Preferences</h2>
        <p className="text-muted-foreground">
          Analyze user behavior and content personalization insights
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
        {/* Category Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Category Engagement</CardTitle>
            <CardDescription>
              User interactions by content category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
                <Bar dataKey="shares" fill="#ffc658" name="Shares" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Preference */}
        <Card>
          <CardHeader>
            <CardTitle>Language Preference</CardTitle>
            <CardDescription>
              User preference by language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languagePreference}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languagePreference.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
            <CardDescription>
              Age distribution of active users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userDemographics} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="ageGroup" type="category" />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Category Preferences</CardTitle>
            <CardDescription>
              Most engaged content categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPreferences.map((pref, index) => (
              <div key={pref.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{pref.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {pref.engagement}%
                    </span>
                    <Badge 
                      variant={pref.trend.startsWith('+') ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {pref.trend}
                    </Badge>
                  </div>
                </div>
                <Progress value={pref.engagement} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Personalization Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Personalization Algorithm Insights</CardTitle>
          <CardDescription>
            How well our algorithm matches user preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <p className="text-sm text-muted-foreground">Content Match Rate</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4.2/5</div>
              <p className="text-sm text-muted-foreground">User Satisfaction</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">73%</div>
              <p className="text-sm text-muted-foreground">Return Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserPreferences
