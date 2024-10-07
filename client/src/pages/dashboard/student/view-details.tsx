import HeadSection, { BackHeadSection } from '@/components/head-section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Briefcase, GraduationCap, Linkedin, Mail, MapPin, Twitter } from 'lucide-react'

export default function ViewDetails() {
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
                        <Card className="w-full max-w-3xl">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Jane Doe</CardTitle>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <GraduationCap className="h-4 w-4" />
                                    <span>Class of 2018</span>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold">Degree</h3>
                                        <p>Bachelor of Science in Computer Science</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Major</h3>
                                        <p>Artificial Intelligence</p>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">Current Position</h3>
                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span>Senior Software Engineer at Tech Innovations Inc.</span>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">Location</h3>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>San Francisco, CA</span>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge>Machine Learning</Badge>
                                        <Badge>Python</Badge>
                                        <Badge>TensorFlow</Badge>
                                        <Badge>Data Analysis</Badge>
                                        <Badge>Cloud Computing</Badge>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">Bio</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Passionate about leveraging AI to solve real-world problems. Experienced in developing scalable machine
                                        learning solutions and contributing to open-source projects.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Contact
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Linkedin className="h-4 w-4 mr-2" />
                                        LinkedIn
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Twitter className="h-4 w-4 mr-2" />
                                        Twitter
                                    </Button>
                                </div>
                                <Button>View Full Profile</Button>
                            </CardFooter>
                        </Card>
                    </main>
                </div>
            </div>
        </>
    )
}