import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function JobsPage() {
  function JobCard({ job }) {
    return (
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-dark">
            {job.title}
          </CardTitle>
          <p className="text-gray-600">{job.company}</p>
        </CardHeader>
        <CardContent>
          <Badge className="bg-pink-100 text-pink-800 mb-2">{job.sector}</Badge>
          <p className="text-gray-700">
            <span className="font-semibold">Location:</span> {job.location}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Salary:</span> {job.salary}
          </p>
        </CardContent>
        <CardFooter>
          <Link href={job.apply_link} className="w-full" target="_blank">
            <Button className="w-full bg-[#dc2446]  text-white">
              Apply Now
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }
  const jobs = [
    {
      id: 1,
      title: "PwC Women in Leadership Program",
      company: "PwC",
      sector: "Consulting, Finance, Business",
      location: "Global",
      salary: "Varies by position",
      apply_link: "https://www.pwc.com/ca/en/about-us/women-in-leadership.html",
    },
    {
      id: 2,
      title: "Flipkart Girls Wanna Code 6.0",
      company: "Flipkart",
      sector: "Technology, Engineering",
      location: "India (Remote/On-site)",
      salary: "Prize-based, Internship opportunities",
      apply_link:
        "https://unstop.com/hackathons/flipkart-girls-wanna-code-60-flipkart-1349594",
    },
    {
      id: 3,
      title: "Uber She++ Program",
      company: "Uber",
      sector: "Technology, Engineering",
      location: "India (Remote/On-site)",
      salary: "Varies by position",
      apply_link: "https://www.uber.com/in/en/careers/sheplusplus/",
    },
    {
      id: 4,
      title: "Google Women Techmakers Program",
      company: "Google",
      sector: "Technology",
      location: "Global",
      salary: "Varies by role",
      apply_link:
        "https://buildyourfuture.withgoogle.com/programs/women-techmakers/",
    },
    {
      id: 5,
      title: "Facebook (Meta) Women in Engineering Internship",
      company: "Meta (Facebook)",
      sector: "Technology, Engineering",
      location: "Global",
      salary: "Varies by role",
      apply_link: "https://www.metacareers.com/",
    },
    {
      id: 6,
      title: "IBM Women in Technology Internship Program",
      company: "IBM",
      sector: "Technology, Engineering, Data Science",
      location: "Global",
      salary: "Varies by role",
      apply_link: "https://www.ibm.com/watson/",
    },
    {
      id: 7,
      title: "LinkedIn Women's Engineering Internship",
      company: "LinkedIn",
      sector: "Technology",
      location: "Global",
      salary: "Varies by role",
      apply_link: "https://www.linkedin.com/jobs/",
    },
    {
      id: 8,
      title: "Deloitte Women's Leadership Program",
      company: "Deloitte",
      sector: "Consulting, Finance, Business",
      location: "U.S./Global",
      salary: "Varies by position",
      apply_link:
        "https://www2.deloitte.com/us/en/careers/women-in-leadership.html",
    },
    {
      id: 9,
      title: "Goldman Sachs Women's Internship Program",
      company: "Goldman Sachs",
      sector: "Finance, Investment Banking",
      location: "New York, NY (Global options available)",
      salary: "Varies by position",
      apply_link: "https://www.goldmansachs.com/careers/",
    },
    {
      id: 10,
      title: "Cisco Women in Technology Internship",
      company: "Cisco",
      sector: "Technology, Networking",
      location: "Global (Remote/On-site)",
      salary: "Varies by position",
      apply_link: "https://www.cisco.com/c/en/us/about/careers.html",
    },
  ];

  return (
    <div className="mt-8">
      <header className="bg-[#dc2446] p-6 shadow-md">
        <h1 className="text-3xl font-bold text-white">Empowering Careers</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </main>
    </div>
  );
}
