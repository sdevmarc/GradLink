import HeadSection, { BackHeadSection } from "@/components/head-section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, GraduationCap, FileText } from "lucide-react"

export default function ViewProgramDetails() {
    const program = {
        name: "Master of Science in Data Science",
        code: "MSDS",
        department: "Department of Computer Science and Statistics",
        duration: "2 years (full-time)",
        credits: 36,
        description: "The Master of Science in Data Science program is designed for graduate students seeking to develop advanced skills in data analysis, machine learning, and statistical modeling. This interdisciplinary program combines rigorous theoretical foundations with practical applications to prepare students for leadership roles in the rapidly evolving field of data science.",
        admissionRequirements: [
            "Bachelor's degree in a related field (e.g., Computer Science, Statistics, Mathematics)",
            "Minimum GPA of 3.5 in undergraduate studies",
            "GRE scores (Quantitative score of 160+ preferred)",
            "Three letters of recommendation",
            "Statement of purpose",
            "CV/Resume"
        ],
        coreCourses: [
            "Advanced Machine Learning",
            "Statistical Inference for Data Science",
            "Big Data Analytics",
            "Data Visualization and Communication",
            "Ethical Issues in Data Science",
            "Capstone Project or Master's Thesis"
        ]
    }

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                        </HeadSection>
                    </aside>
                    <main className="flex justify-center items-center py-4">
                        <div className="min-h-screen bg-gray-100 p-8">
                            <Card className="w-full max-w-4xl mx-auto">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-3xl font-bold">{program.name}</CardTitle>
                                            <CardDescription className="mt-2">
                                                <Badge variant="secondary" className="mr-2">{program.code}</Badge>
                                                <span className="text-muted-foreground">{program.department}</span>
                                            </CardDescription>
                                        </div>
                                        {/* <Button>Apply Now</Button> */}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <section className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                                                <span>Duration: {program.duration}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                <span>Credits: {program.credits}</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold">Curriculum</h2>
                                        <div>
                                            <h3 className="font-semibold text-lg">Core Courses</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                {program.coreCourses.map((course, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
                                                        {course}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mt-4">Thesis/Capstone</h3>
                                            <div className="flex items-start mt-2">
                                                <FileText className="h-5 w-5 mr-2 mt-1 text-muted-foreground" />
                                                <p>
                                                    Students must complete either a master's thesis or a capstone project to graduate. The thesis option is recommended for students planning to pursue a Ph.D., while the capstone project is ideal for those seeking industry positions.
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </CardContent>
                                {/* <CardFooter className="flex justify-between">
                                    <Button variant="outline">Download Program Handbook</Button>
                                    <Button>Schedule a Consultation</Button>
                                </CardFooter> */}
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}