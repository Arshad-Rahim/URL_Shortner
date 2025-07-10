import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/redux/slice/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LinkIcon,
  Copy,
  ExternalLink,
  LogOut,
  Plus,
  Eye,
  Calendar,
  MousePointer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
}

interface RootState {
  user: {
    userDatas: {
      _id: string;
      name: string;
      email: string;
    } | null;
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDatas = useSelector((state: RootState) => state.user.userDatas);
  const [user, setUser] = useState<User | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUrls, setTotalUrls] = useState(0);
  const limit = 5;

  useEffect(() => {
    if (!userDatas) {
      navigate("/login");
      return;
    }

    setUser({ name: userDatas.name, email: userDatas.email });
  }, [navigate, userDatas]);

  const refreshToken = async () => {
    if (isRefreshing) return false;
    setIsRefreshing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      setIsRefreshing(false);
      return true;
    } catch (error) {
      setIsRefreshing(false);
      dispatch(removeUser());
      navigate("/login");
      return false;
    }
  };

  const fetchUrls = async (pageNum: number, retry = true) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/code/urlDatas?page=${pageNum}&limit=${limit}`,
        {
          credentials: "include",
        }
      );

      if (response.status === 401 && retry) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return fetchUrls(pageNum, false);
        }
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch URL data");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.urlDatas)) {
        const mappedUrls: ShortenedUrl[] = data.urlDatas.map((url: any) => ({
          id: url._id.toString(),
          originalUrl: url.longUrl,
          shortUrl: `${import.meta.env.VITE_BASE_URL}/${url.shortCode}`,
          shortCode: url.shortCode,
          clicks: url.clicks || 0,
          createdAt: new Date(url.createdAt).toISOString().split("T")[0],
        }));

        setUrls((prevUrls) => {
          const isSame =
            prevUrls.length === mappedUrls.length &&
            prevUrls.every(
              (prev, i) =>
                prev.id === mappedUrls[i].id &&
                prev.originalUrl === mappedUrls[i].originalUrl &&
                prev.shortUrl === mappedUrls[i].shortUrl &&
                prev.clicks === mappedUrls[i].clicks &&
                prev.createdAt === mappedUrls[i].createdAt
            );
          return isSame ? prevUrls : mappedUrls;
        });

        setTotalUrls(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(data.message || "Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error fetching URLs:", error);
      setAlert({
        type: "error",
        message: error.message || "Failed to fetch URLs",
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  useEffect(() => {
    if (userDatas) {
      fetchUrls(page);
    }
  }, [userDatas, page]);

  const incrementClickCount = async (urlId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/code/increment-click/${urlId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return incrementClickCount(urlId);
        }
        throw new Error("Failed to increment click count");
      }

      const data = await response.json();
      if (data.success) {
        setUrls((prevUrls) =>
          prevUrls.map((url) =>
            url.id === urlId ? { ...url, clicks: data.clicks } : url
          )
        );
      }
    } catch (error: any) {
      console.error("Error incrementing click count:", error);
      setAlert({
        type: "error",
        message: "Failed to update click count",
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleShortenUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      setAlert({ type: "error", message: "Please enter a URL to shorten" });
      return;
    }

    try {
      new URL(originalUrl);
    } catch {
      setAlert({ type: "error", message: "Please enter a valid URL" });
      return;
    }

    if (!userDatas) {
      setAlert({ type: "error", message: "User data not found" });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/code/shorten`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originalUrl,
            customAlias,
            userId: userDatas._id,
          }),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return handleShortenUrl(e);
        }
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to shorten URL");
      }

      const newUrl = await response.json();
      setUrls((prev) => [
        {
          id: newUrl.id,
          originalUrl: newUrl.originalUrl,
          shortUrl: newUrl.shortUrl,
          shortCode: newUrl.shortCode,
          clicks: newUrl.clicks || 0,
          createdAt: new Date(newUrl.createdAt).toISOString().split("T")[0],
        },
        ...prev,
      ]);
      setOriginalUrl("");
      setCustomAlias("");
      setAlert({ type: "success", message: "URL shortened successfully!" });
      fetchUrls(page);
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "Failed to shorten URL",
      });
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setAlert(null), 3000);
  };

  const copyToClipboard = async (text: string, urlId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      await incrementClickCount(urlId);
      setAlert({ type: "success", message: "Copied to clipboard!" });
      setTimeout(() => setAlert(null), 2000);
    } catch {
      setAlert({ type: "error", message: "Failed to copy to clipboard" });
      setTimeout(() => setAlert(null), 2000);
    }
  };

  const handleNavigateClick = async (urlId: string) => {
    await incrementClickCount(urlId);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      dispatch(removeUser());
      navigate("/");
    } catch {
      dispatch(removeUser());
      navigate("/");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ShortLink</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {alert && (
          <Alert
            className={`mb-6 ${
              alert.type === "success"
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <AlertDescription
              className={
                alert.type === "success" ? "text-green-700" : "text-red-700"
              }
            >
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUrls}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clicks
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalClicks.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Shorten New URL
            </CardTitle>
            <CardDescription>
              Enter a long URL to create a shortened version
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleShortenUrl} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalUrl">Original URL *</Label>
                  <Input
                    id="originalUrl"
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customAlias">Custom Alias (Optional)</Label>
                  <Input
                    id="customAlias"
                    type="text"
                    placeholder="my-custom-link"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? "Shortening..." : "Shorten URL"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Shortened URLs</CardTitle>
            <CardDescription>
              Manage and track your shortened links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Short URL</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url.id}>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={url.originalUrl}>
                          {url.originalUrl}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-gray-100 px-2 py-1 rounded"
                          >
                            {url.shortUrl}
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(url.shortUrl, url.id)
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span>{url.clicks.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{url.createdAt}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNavigateClick(url.id)}
                            asChild
                          >
                            <a
                              href={url.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {urls.length === 0 && (
              <div className="text-center py-8">
                <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No URLs yet
                </h3>
                <p className="text-gray-500">
                  Create your first shortened URL using the form above.
                </p>
              </div>
            )}

            {totalUrls > limit && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
