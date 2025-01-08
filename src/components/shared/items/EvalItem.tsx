import { BLOCKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import { Box, Prose } from "@/components/global/matic-ds";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

interface EvalItemProps {
    label: string;
    value: number;
    desc: {
        json: Document;
    }
}

interface ContentNode {
    nodeType: string;
    value?: string;
    content?: ContentNode[];
}

const options = {
    renderNode: {
        [BLOCKS.PARAGRAPH]: (node: { content: ContentNode[] }) => {
            return (
                <p style={{ margin: '1em 0' }}>
                    {node.content.map((content, index) => {
                        if (content.nodeType === 'text' && content.value) {
                            return content.value.split('\n').map((line, lineIndex) => (
                                <span key={`${index}-${lineIndex}`}>{line}<br /></span>
                            ));
                        }
                        return null;
                    })}
                </p>
            );
        },
    },
};

export const EvalItem = ({ label, value, desc }: EvalItemProps) => {
    return (
        <Box direction="col" className="">
            <Box direction="row" className="justify-between">
                <h4 className="">{label}</h4>
                <p className="text-3xl font-light">{value}</p>
            </Box>
            {desc?.json ? (
                <Prose className="">{documentToReactComponents(desc.json, options)}</Prose>
            ) : (
                <p>No description available.</p>
            )}
        </Box>
    )
}