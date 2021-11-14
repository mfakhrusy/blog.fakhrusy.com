import { getDateStr } from '../lib/blog-helpers'

type Props = {
  date: Date | undefined
}

export function PostedDate({ date }: Props) {
  if (date) {
    return (
      <div className="posted">
        <small>{getDateStr(date)}</small>
      </div>
    )
  } else {
    return null
  }
}
