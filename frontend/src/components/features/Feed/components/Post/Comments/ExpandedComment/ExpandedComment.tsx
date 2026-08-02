import {useParams} from 'react-router-dom';
import style from './ExpandedComment.module.css'

export function ExpandedComment () {
    const params = useParams()
    
    return <div className={style.expandedCommentContainer}> {params.commentid}</div>
}