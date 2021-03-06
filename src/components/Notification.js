import React from 'react';
import styled from 'styled-components'
import { 
	Button 
} from 'antd'
import { 
	toast, 
	ToastContainer 
} from 'react-toastify';
import { 
	CheckCircleOutlined, 
	ExclamationCircleOutlined,
	CloseCircleOutlined,
	LoadingOutlined,
	PlusCircleOutlined
} from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.min.css';

const Type = {
	SUCCESS: 'SUCCESS',
	WARNING: 'WARNING',
	ERROR: 'ERROR',
	PROCESSING: 'PROCESSING',
	DEFAULT: 'DEFAULT',
}

const Icons = {
	SUCCESS: <CheckCircleOutlined />,
	WARNING: <ExclamationCircleOutlined />,
	ERROR: <CloseCircleOutlined />,
	PROCESSING: <LoadingOutlined />,
	DEFAULT: <PlusCircleOutlined />
}

const defaultDuration = 5000

const animationSpeed = 300

const Notification = styled(
	({type, title, text, links=[], className}) =>  <div 
		className={`notification -item ${className}`}
		data-type={type}
		>
		<span className="-left">
			{Icons[type]}
		</span>
		<span className="-right">
			<div className="-title" dangerouslySetInnerHTML={{__html: title }}/>
			{text && <div className="-text"  dangerouslySetInnerHTML={{__html: text.length > 100 ? `${text.substring(0,97)}...` : text }}/>}
			{links.length > 0 && 
				<div className="-links">
					{links.map(({text, ...rest}, i) => <Button {...rest} key={i} small>{text}</Button>)}
				</div>
			}
		</span>
	</div>
	)`
	background: var(--color-light);
	display: flex;
	//width: 30rem;
	overflow: hidden;
	transition: all ${animationSpeed}ms ease-in-out;
	margin-bottom: 0;
	border: none;
	border-radius: var(--notification--border-radius, 1rem);
	padding: 1.5rem 1.7rem 1.4rem;
	cursor: e-resize;
	>.-left{
		padding-right: 0.8rem;
		display: block;
		svg{
			font-size: calc(var(--notification--title--font-size, 12px) * 1.3);
			width: 1em;
			height: 1em;
			display: block;
		}
	}
	>.-right{
		display: inline-block;
		.-title{
			font-size: var(--notification--title--font-size, 14px);
			color: inherit;
			line-height: 1.6rem;
			margin: 0;
			display: inline-block;
			word-break: break-word;
		}
		.-text{
			font-size: var(--notification--text--font-size, 12px);
			font-weight: 200;
			color: inherit;
			margin-top: 0.8rem;
			line-height: 1.4rem;
			opacity: 0.7;
			word-break: break-word;
			display: inline-block;
		}
		.-links{
			margin-top: 1rem;
			.button{
				font-size: var(--font-size-small);
				color: var(--color-dark-grey);
				font-weight: 400;
				text-transform: uppercase;
				opacity: 0.6;
				&:hover{
					opacity: 1
				}
			}
		}
	}
	&[data-type="SUCCESS"]{
		color: black;
		background: #74DB8A;
	}
	&[data-type="WARNING"]{
		color: black;
		background: #FFC75A;
	}
	&[data-type="ERROR"]{
		color: black;
		background: #E95E66;
	}
	&[data-type="DEFAULT"]{
		color: black;
		background: #bbb;
	}
	&[data-type="PROCESSING"]{
		color: black;
		background: #E9A9FF;
	}
	`

const Container = styled(
	({className}) => <ToastContainer autoClose={false} closeButton={null} className={`notification-container ${className}`}/>
	)`
	position: fixed;
	top: 1em;
	right: 1em;
	display: block;
	padding: 0;
	.Toastify__toast{
		padding: 0;
		background: none;
		box-shadow: none;
		margin-bottom: 0;
		min-height: 0;
		& + .Toastify__toast{
			margin-top: 0.5rem;
		}
		.Toastify__toast-body{
			margin: 0;
		}
	}
	`

const formatProps = props => {
	let options = {
		title: props,
		duration: defaultDuration
	}

	if(typeof props === 'object'){
		options.title = props.title
		options.text = props.text
		options.links = props.links||[]
		options.duration = props.duration === -1 ? null : props.duration||defaultDuration
	}

	return options
}

const update = (id, type=Type.DEFAULT, newProps={}) => {
	const formattedProps = formatProps(newProps)
	const newComponent = <Notification type={type} {...formattedProps}/>
	
	toast.update(id, {
		render: newComponent,
		autoClose: formattedProps.duration,
	})
}

export const add = (type=Type.DEFAULT, props={}) => {
	const id = '_' + Math.random().toString(36).substr(2, 10)
	const formattedProps = formatProps(props)
	toast(<Notification type={type} {...formattedProps}/>, {
		toastId: id,
		position: "top-right",
		autoClose: formattedProps.duration,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: false,
		pauseOnFocusLoss: false,
		draggable: false,
		progress: false,
	});

	return {
		success: newProps => update(id, Type.SUCCESS, newProps),
		warning: newProps => update(id, Type.WARNING, newProps),
		error: newProps => update(id, Type.ERROR, newProps),
		processing: newProps => update(id, Type.PROCESSING, newProps),
		default: newProps => update(id, Type.DEFAULT, newProps),
		close: () => toast.dismiss(id), 
	}
}


Container.success = props => add(Type.SUCCESS, props)
Container.warning = props => add(Type.WARNING, props)
Container.error = props => add(Type.ERROR, props)
Container.processing = props => add(Type.PROCESSING, props)
Container.default = props => add(Type.DEFAULT, props)



export default Container
