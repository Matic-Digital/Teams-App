import { Box } from "../global/matic-ds";
import { Container } from "../global/matic-ds";
import { Section } from "../global/matic-ds";
import { Button } from "../ui/button";

export default function SimplifyCTA() {
    return (
        <Section className='bg-gradient-to-l from-[#190848] to-[#000227]'>
            <Container>
                <Box direction='col' gap={8} className="py-12">
                    <Box direction='col' className='items-center justify-center'>
                        <h2 className="text-white text-center font-semibold">
                            Hiring shouldn&#39;t be so hard.
                        </h2>
                        <h1 className="text-[#32d583] font-semibold">
                            We simplified it.
                        </h1>
                    </Box>
                    <p className="text-white text-center">More than just &#39;top talent&#39; - connect with the same people we trust for our own projects.</p>
                    <Box gap={8} className="items-center justify-center flex-col lg:flex-row">
                        <Box direction='col' gap={4}>
                            <div className="border-2 border-white text-white rounded-full mx-auto px-4 py-2 font-extrabold">1</div>
                            <Box direction='col' gap={4} className="text-white items-center justify-center text-center">
                                <h3>Let&#39;s connect</h3>
                                <p className="text-white min-w-[16rem] max-w-[18rem]">Brief discovery with Matic to understand your goals, working objectivese and requirements.</p>
                            </Box>
                        </Box>
                        <Box direction='col' gap={4}>
                            <div className="border-2 border-white text-white rounded-full mx-auto px-4 py-2 font-extrabold">2</div>
                            <Box direction='col' gap={4} className="text-white items-center justify-center text-center">
                                <h3>Meet the team</h3>
                                <p className="text-white min-w-[16rem] max-w-[18rem]">Review curated talent profiles for a perfect fit. We&#39;ll help schedule introductions with your team.</p>
                            </Box>
                        </Box>
                        <Box direction='col' gap={4}>
                            <div className="border-2 border-white text-white rounded-full mx-auto px-4 py-2 font-extrabold">3</div>
                            <Box direction='col' gap={4} className="text-white items-center justify-center text-center">
                                <h3>Get shipping</h3>
                                <p className="text-white min-w-[16rem] max-w-[18rem]">Onboarding, billing, and ongoing built-in support made seamless during the engagement.</p>
                            </Box>
                        </Box>
                    </Box>
                    <Button className='mx-auto'>Get Started</Button>
                </Box>
            </Container>
        </Section>
    )
} 